import { inject, singleton } from 'aurelia-framework';
import { Session} from './session';
import PouchDB from 'pouchdb';
import PouchdbUpsert from 'pouchdb-upsert';
import moment from 'moment';
import { EventAggregator } from 'aurelia-event-aggregator';
import { HttpClient } from 'aurelia-fetch-client';
import { log } from './log';
import settings from '../config/app-settings';
import { ShardingService } from './sharding-service';
import environment from '../environment';

@inject(Session, ShardingService, HttpClient, EventAggregator)
@singleton()
export class DBService {

    //dbs currently connected and their sync handlers
    dbs = new Map();
    syncHandlers = new Map();
    
    //moments when dbs get updated and synced to remote
    lastUpdates = new Map();
    lastSyncs = new Map();

    //array if database patterns that are synced live with remote
    liveReplicates = [
        '^accounting$',
        '^allocation$',
        '^interpret$',
        '^purpose$',
        '^timesheet\-{0}$'
    ];

    constructor(session, sharding, http, ea) {
        this.session = session;
        this.sharding = sharding;
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
        
        //don't sync with remote in testing environment
        if (environment.testing) {
            return db;
        }
        
        this.addUpdateCheckpoint(dbName);

        let handler = db.sync(
            this.sharding.getRemoteUrl() + dbName, 
            me.getSyncOptions(dbName)
        ).on('change', function (change) {

            me.addSyncCheckpoint(dbName);

            //notify the application that data may have changed
            if (change.direction === 'pull') {
                me.ea.publish('dbsync', {dbName: dbName});
            }

        }).on('paused', function (err) {
            //paused if no more data to sync or disconnected
            //add sync marker although it's possible some new local data was not 
            //yet synced with remote if disconnected.
            //Need to find a better way to handle this
            // 1. User enters new data
            // 2. User disconnects before new data is synced
            // -> marker set as synced
            //probably need different marker for incoming and outgoing syncs
            me.addSyncCheckpoint(dbName);
        }).on('error', function (err) {
            me.handleSyncError(db, err);
        });

        this.syncHandlers.set(dbName, handler);

        return db;

    }

    isLiveReplicate(dbName) {

        let user = atob(localStorage.getItem('aurelia_token')).split(':')[0];
        for (let db of this.liveReplicates) {
            if (dbName.match(new RegExp(db.replace('{0}', user)))) {
                return true;
            }
        }
        return false;

    }

    getSyncOptions(dbName) {
        //We can't use live replication with all databases as browsers have a limit
        //on the number of active connections per host.
        //The shrading service does not work over https for cloudant
        //So for now, only replicate live restricted databases
        let token = localStorage.getItem('aurelia_token');
        let options = {
            ajax: {
                "headers": {
                    "Authorization": "Basic " + token
                }
            }
        }

        if (this.isLiveReplicate(dbName)) {
            options.live = true;
            options.retry = true;
        }
        
        return options;
    }

    handleSyncError(db, err) {
        //destroy local database if permission has been revoked or remote database has been deleted
        if (err.status === 403 || err.status === 404) {
            this.removeDB(db);
        } else if (err.status === 401) {
            //unauthorized, user has been revoked or password changed. Remove local storage
            this.session.invalidate();
        } else if (err.result !== undefined && err.result.status === 'cancelled') {
            //seems to happen when removing the databases while they are syncing
            log.error(err);            
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

    removeDB(db) {
        if (this.syncHandlers.has(db.name)) {
            this.syncHandlers.get(db.name).cancel();
            this.syncHandlers.delete(db.name);
        }
        this.dbs.delete(db.name);
        this.removeUpdateCheckpoint(db.name);
        this.removeSyncCheckpoint(db.name);
        return db.destroy();
    }

    //removes all databases
    removeDBs() {
        let me = this;
        let promises = [];
        //stop replication on all databases
        this.dbs.forEach(function (db, dbName) {
            promises.push(me.removeDB(db));
        });

        return Promise.all(promises)
        .then( () => {

            //remove all indexdb databases (some might be there but no mounted in memory)
            //https://gist.github.com/rmehner/b9a41d9f659c9b1c3340
            window.indexedDB.webkitGetDatabaseNames().onsuccess = function(event) {
                Array.prototype.forEach.call(event.target.result, indexedDB.deleteDatabase.bind(indexedDB));
            }

            //also remove sync markers
            localStorage.removeItem('last-updates');
            localStorage.removeItem('last-syncs');
            this.lastUpdates.clear();
            this.lastSyncs.clear();
            return new Promise( (resolve) => resolve() );
        });

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
        return this.http.fetch(this.sharding.getRemoteUrl() + '_users/_all_docs?include_docs=true')
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
            .catch ( err => { log.error(err); });
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

    replicate(dbName) {
        let me = this;
        return PouchDB.replicate(dbName, this.sharding.getRemoteUrl() + dbName)
        .on('change', function (change) {
            me.addSyncCheckpoint(dbName);
            return new Promise( (resolve) => resolve(true) );
        }).on('error', function (err) {
            me.handleSyncError(db, err);
            return new Promise( (resolve) => resolve(false) );
        });        
    }

    save(dbName, doc) {

        this.addUpdateCheckpoint(dbName);
        
        let db = this.getDB(dbName);
        let me = this;

        return db.put(doc)
        .then(function (response) {
            //if the database is not replicated live, manually sync it now
            if (!me.isLiveReplicate(dbName)) {
                return me.replicate(dbName)
                .then( (success) => {
                    return response;
                });
            }

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
            //if the database is not replicated live, manually sync it now
            if (!this.isLiveReplicate(dbName)) {
                return this.replicate(dbName)
                .then( (success) => {
                    return response;
                });
            }
            return response;
        })
        .catch(function (err) {
            me.handleUpdateError(db, doc, err);
        });

    }

    addUpdateCheckpoint(dbName) {
        this.lastUpdates.set(dbName, Date.now());

        //persist to storage in case user closes browser
        this.persistMap(this.lastUpdates, 'last-updates');
    }

    addSyncCheckpoint(dbName) {
        this.lastSyncs.set(dbName, Date.now());

        //persist to storage in case user closes browser
        this.persistMap(this.lastSyncs, 'last-syncs');
    }

    removeUpdateCheckpoint(dbName) {
        this.lastUpdates.delete(dbName);
        this.persistMap(this.lastUpdates, 'last-updates');
    }

    removeSyncCheckpoint(dbName) {
        this.lastSyncs.delete(dbName);
        this.persistMap(this.lastSyncs, 'last-syncs');
    }

    persistMap(map, name) {
        let storage = [];
        map.forEach( (value, key) => storage = [...storage, [key, value]] );
        localStorage.setItem(name, JSON.stringify(storage));
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

        //no syncing on test env
        if (environment.testing) {
            return false;
        }

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