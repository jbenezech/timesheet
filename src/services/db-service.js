import { inject, singleton } from 'aurelia-framework';
import { Session} from './session';
import PouchDB from 'pouchdb';
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
    userDBs = [
        'timesheet'
    ];

    constructor(session, http, ea) {
        this.session = session;
        this.http = http;
        this.ea = ea;
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
            me.lastSyncs.set(dbName, Date.now());

            //notify the application that data may have changed
            if (change.direction === 'pull') {
                me.ea.publish('dbsync', {dbName: dbName});
            }

        }).on('error', function (err) {
            console.log(err);
            me.handleSyncError(db, err);
        });

        this.syncHandlers.set(dbName, handler);

        return db;

    }

    getSyncOptions() {
        return {
            live: true,
            retry: true,
            
            ajax: {
                "withCredentials": false,
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
        }
    }

    //removes all databases that are specific to the current user
    removeUserDBs() {
        let me = this;
        //stop replication on all databases
        this.userDBs.forEach(function (dbPrefixes) {
            let dbName = dbPrefixes + '-' + me.session.getUser().name;

            if (!me.dbs.has(dbName)) {
                return;
            }

            me.syncHandlers.get(dbName).cancel();
            me.syncHandlers.delete(dbName);
            me.dbs.get(dbName).destroy();
            me.dbs.delete(dbName);
            
        });

        //remove staff db
        if (this.dbs.has('staff')) {
            this.dbs.get('staff').destroy();
            this.dbs.delete('staff');
        }
    }

    listUsers() {

        //we cannot replicate the _users database even with admin access to it
        //so we copy it partially if we can retrieve it

        if (!this.dbs.has('staff')) {
            let db = new PouchDB('staff', {skip_setup: true});
            this.dbs.set('staff', db);
        } 

        let db = this.dbs.get('staff');

        let promises = [];

        //we can't access design documents on _users database so we retrieve all docs        
        return this.http.fetch('https://proacti.cloudant.com/_users/_all_docs?include_docs=true')
        .then(response => response.json())
        .then(users => {
            let filteredUsers = [];
            users.rows.forEach( (user) => {

                //all_docs returns everything including design documents.
                //filter for users only
                if (user.id.match(/^org\.couchdb\.user/)) {

                    let localUser = {
                        id: user.doc._id,
                        doc: {
                            _id: user.doc._id,
                            name: user.doc.name,
                            roles: user.doc.roles
                        }
                    }
                    filteredUsers.push(localUser);

                    promises.push(
                        db.get(localUser.id).then( (doc) => {
                            //replace existing doc if it exists or create it if not
                            if (doc) {
                                localUser.doc._rev = doc._rev;
                            }
                            db.put(localUser.doc);
                        }).catch( (err) => {
                            if (err.status === 404) {
                                db.put(localUser.doc);
                            }
                        })
                    );
                }
            });

            //return the filtered users array only when all promises are resolved
            return Promise.all(promises).then( () => filteredeUsers );
        })
        .catch( err => {
            //if we cannot connect to remote, retrieve local staff database
            return db.allDocs({include_docs: true}).then( (result) => result.rows);
        })

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

    view(dbName, viewName, startKey = '', endKey = '', group = false) {

        return this.getDB(dbName).query(
            viewName,
            {
                start_key: startKey,
                end_key: endKey,
                group: group
            }
        )
        .then(function (response) {
            return response.rows;
        })
        .catch(function (err) {
            log.error(err);
        });

    }

    save(dbName, doc) {

        this.lastUpdates.set(dbName, Date.now());

        return this.getDB(dbName).put(doc)
        .then(function (response) {
            return response;
        })
        .catch(function (err) {
            log.error(err);
        });

    }

    create(dbName, doc) {

        this.lastUpdates.set(dbName, Date.now());

        return this.getDB(dbName).post(doc)
        .then(function (response) {
            return response;
        })
        .catch(function (err) {
            log.error(err);
        });

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