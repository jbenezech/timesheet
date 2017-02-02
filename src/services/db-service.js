import { inject, singleton } from 'aurelia-framework';
import { Session} from './session';
import PouchDB from 'pouchdb';
import PouchdbUpsert from 'pouchdb-upsert';
import moment from 'moment';
import { EventAggregator } from 'aurelia-event-aggregator';
import { HttpClient } from 'aurelia-fetch-client';
import { log } from './log';

@inject(Session, HttpClient, EventAggregator)
@singleton()
export class DBService {

    //dbs currently connected and their sync handlers
    dbs = new Map();
    syncHandlers = new Map();
    
    //moments when dbs get updated and synced to remote
    lastUpdates = new Map();
    lastSyncs = new Map();

    //db prefixes for user-specific databases
    userDBPrefixes = [
        'timesheet'
    ];

    //list of user db names that have been loaded
    userDBs = [];

    constructor(session, http, ea) {
        this.session = session;
        this.http = http;
        this.ea = ea;

        this.restoreCheckpoints();

        PouchDB.plugin(PouchdbUpsert);
    }

    getDB(dbName) {

        if (!this.dbs.has(dbName)) {
            let db = this.setupDB(dbName);
            this.dbs.set(dbName, db);
        }
        return this.dbs.get(dbName);

    } 

    setupDB(dbName) {

        let me = this;

        let db = new PouchDB(dbName,{skip_setup: true});
        
        let handler = db.sync(
            'https://proacti.cloudant.com/' + dbName, 
            me.getSyncOptions()
        ).on('change', function (change) {
            me.addSyncCheckpoint(dbName);

            //notify the application that data may have changed
            if (change.direction === 'pull') {
                me.ea.publish('dbsync', {dbName: dbName});
            }

        }).on('error', function (err) {
            me.handleSyncError(db, err);
        });

        this.syncHandlers.set(dbName, handler);

        this.userDBPrefixes.forEach( (prefix) => {
            if (dbName.match(new RegExp("^" + prefix))) {
                me.userDBs.push(dbName);
            }
        });

        return db;

    }

    getSyncOptions() {
        return {
            live: true,
            retry: true,            
            ajax: {
                "headers": {
                    "Authorization": "Basic " + localStorage.getItem('aurelia_token')
                }
            }
        };
    }

    handleSyncError(db, err) {
        //destroy local database if permission has been revoked or remote database has been deleted
        if (err.status === 403 || err.status === 404) {

            this.syncHandlers.get(db.name).cancel();    
            this.syncHandlers.delete(db.name);
            db.destroy();
            this.dbs.delete(db.name);

        } else if (err.status === 401) {
            //unauthorized, user has been revoked or password changed. Remove local storage
            this.session.invalidate();
        } else {
            //Not sure what error this is but we need to report it
            this.ea.publish('dberr', {dbName: db.name, err: err});
        }
    }

    handleUpdateError(db, doc, err) {

        //only handling immediate conflicts by retrying
        //let pouchdb handle evantual conflicts
        if (err.status === 409 && err.name === 'conflict') {
            //immediate conflict
            db.upsert(doc._id, () => {                
                return doc; 
            }).catch( err => {
                log.error(err);
                this.ea.publish('dberr', {dbName: db.name, doc: doc, err: err});
            });
        }
    }

    //removes all databases that are specific to the current user
    removeUserDBs() {
        let me = this;
        let promises = [];
        //stop replication on all databases
        this.userDBs.forEach(function (dbName) {

            log.debug("Try deleting " + dbName);

            if (me.dbs.has(dbName)) {

                me.syncHandlers.get(dbName).cancel();
                me.syncHandlers.delete(dbName);
                me.dbs.get(dbName).destroy();
                promises.push(me.dbs.delete(dbName));

                log.debug("Deleted " + dbName);

            }
            
        });

        //remove staff db
        if (this.dbs.has('staff')) {
            this.dbs.get('staff').destroy();
            promises.push(this.dbs.delete('staff'));
        }

        return Promise.all(promises);
    }

    listUsers() {

        //we cannot replicate the _users database even with admin access to it
        //so we copy it partially if we can retrieve it

        if (!this.dbs.has('staff')) {
            let db = new PouchDB('staff', {skip_setup: true});
            this.dbs.set('staff', db);
        } 

        let db = this.dbs.get('staff');

        let me = this;
        let promises = [];

        //we can't access design documents on _users database so we retrieve all docs        
        return this.http.fetch('https://proacti.cloudant.com/_users/_all_docs?include_docs=true')
        .then(response => response.json())
        .then(users => {

            return Promise.all(
                users.rows.filter( (user) => {
                    return user.id.match(/^org\.couchdb\.user/);
                }).map( (user) => {

                    let localUser = {
                        id: user.doc._id,
                        doc: {
                            _id: user.doc._id,
                            name: user.doc.name,
                            originRev: user.doc._rev,
                            roles: user.doc.roles
                        }
                    }

                    return this.createOrReplaceLocalUser(localUser);

                })
            );

        }).then( (filteredUsers) => {
            return filteredUsers;
        }).catch( err => {
            //if we cannot connect to remote, retrieve local staff database
            return db.allDocs({include_docs: true})
            .then( (result) => result.rows)
            .catch ( err => { log.debug(err); });
        })

    }

    createOrReplaceLocalUser(user) {

        let db = this.dbs.get('staff');

        let me = this;
        //replace existing doc if it exists or create it if not
        return db.get(user.id)
        .then( (doc) => {
            
            if (doc.originRev === user.doc.originRev) {
                return new Promise( (resolve) => resolve(user) );
            }

            user.doc._rev = doc._rev;
            return db.put(user.doc)
            .then ( () => user )
            .catch(err => {
                return me.handleUpdateError(db, user.doc, err);
            });
        }).then( (r) => {
            return user;                    
        }).catch( (err) => {
            if (err.status === 404) {
                return db.put(user.doc)
                .then( () => {
                    return user;
                }).catch(err => {
                    return me.handleUpdateError(db, user.doc, err);
                });
            }
        });

    }

    list(dbName, limit = false, descending = false) {

        let options = {
            include_docs: true
        }
        if (limit) {
            options.limit = limit;
        }
        if (descending) {
            options.descending = descending;
        }

        //To exclude design docs when listing documents, we need 2 separate requests
        //https://issues.apache.org/jira/browse/COUCHDB-2227

        //if descending, get the last docs first. Otherwise start with alpha order
        let firstRequestOptions = Object.assign({}, options);
        let secondRequestOptions = Object.assign({}, options);

        if (descending) {
            firstRequestOptions.endkey = '_design\uffff';
            secondRequestOptions.startkey = '_design';
        } else {
            firstRequestOptions.endkey = '_design';
            secondRequestOptions.startkey = '_design\uffff';
        }

        let me = this;
        
        return this.getDB(dbName).allDocs(firstRequestOptions)
        .then(function (results) {
        
            return me.getDB(dbName).allDocs(secondRequestOptions)
            .then(function (endResults) {
        
                return [
                    ...results.rows,
                    ...endResults.rows
                ];
        
            }).catch(function (err) {
                log.error(err);
            });
            
        }).catch(function (err) {
            log.error(err);
        });
    }

    get(dbName, id) {

        return this.getDB(dbName).get(id, {})
        .then(function (result) {
            return result;
        }).catch(function (err) {
            log.error(err);
        });
    }

    view(dbName, viewName, startKey = '', endKey = '', group = false, descending = false, limit = 0) {

        let options = {
            start_key: startKey,
            end_key: endKey,
            group: group,
            descending: descending
        }

        if (limit > 0) {
            options.limit = limit;
        }

        return this.getDB(dbName).query(
            viewName,
            options
        )
        .then(function (response) {
            return response.rows;
        })
        .catch(function (err) {
            log.error(err);
        });

    }

    save(dbName, doc) {

        this.addUpdateCheckpoint(dbName);
        
        let db = this.getDB(dbName);
        let me = this;

        return db.put(doc)
        .then(function (response) {
            return response;
        })
        .catch(function (err) {
            me.handleUpdateError(db, doc, err);
        });

    }

    create(dbName, doc) {

        this.addUpdateCheckpoint(dbName);

        let db = this.getDB(dbName);
        let me = this;

        return db.post(doc)
        .then(function (response) {
            return response;
        })
        .catch(function (err) {
            me.handleUpdateError(db, doc, err);
        });

    }

    addUpdateCheckpoint(dbName) {

        this.lastUpdates.set(dbName, Date.now());

        //persist to storage in case user closes browser
        let storage = [];
        this.lastUpdates.forEach( (value, key) => storage = [...storage, [key, value]] );
        localStorage.setItem('last-updates', JSON.stringify(storage));
    }

    addSyncCheckpoint(dbName) {
        this.lastSyncs.set(dbName, Date.now());

        //persist to storage in case user closes browser
        let storage = [];
        this.lastSyncs.forEach( (value, key) => storage = [...storage, [key, value]] );
        localStorage.setItem('last-syncs', JSON.stringify(storage));
    }

    restoreCheckpoints() {
        if (localStorage.getItem('last-updates') !== null) {
            this.lastUpdates = new Map(JSON.parse(localStorage.getItem('last-updates')));
        }
        if (localStorage.getItem('last-syncs') !== null) {
            this.lastSyncs = new Map(JSON.parse(localStorage.getItem('last-syncs')));
        }
    }

    hasUnsyncedUpdate() {

        let hasUnsynced = false;
        let me = this;

        this.lastUpdates.forEach(function (lastUpdate, dbName) {

            if (
                !me.lastSyncs.has(dbName) ||
                me.lastUpdates.get(dbName) > me.lastSyncs.get(dbName)
            ) {
                hasUnsynced = true;
            }

        });

        return hasUnsynced;  
    }
}