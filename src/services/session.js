import { inject, singleton } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { AuthService } from 'aurelia-auth';
import {I18N} from 'aurelia-i18n';
import PouchDB from 'pouchdb';

import settings from '../config/app-settings';
import { log } from './log';
import { ShardingService } from './sharding-service';

@singleton()
@inject(Router, AuthService, ShardingService, I18N)

/**
 * Service to handle session related information
 */
export class Session {

    constructor(router, auth, sharding, i18n) {
        this.router = router;
        this.auth = auth;
        this.sharding = sharding;
        this.i18n = i18n;

        this.loadFromStorage();
        this.locale = this.getLocale();
        this.i18n
            .setLocale(this.locale);

        this.started = false;
    }
    
    start() {
        let me = this;

        //reload the user from remote if possible when the session start
        //in case his info have changed
        return this.loadUserFromBackend().then( () => {

            me.started = true;
            return new Promise((resolve) => { resolve(); });
            
        }).catch (function (err) {
            log.error(err);
        });
    }

    isStarted() {
        return this.started;
    }

    loadFromStorage() {
        if (localStorage.getItem('session') !== null) {
            let session = JSON.parse(localStorage.getItem('session'));
            this.user = session.user;
            this.locale = session.locale;
        }
    }

    persistToStorage() {
        let session = {
            'user': this.user,
            'locale': this.locale
        };

        localStorage.setItem('session', JSON.stringify(session));
    }

    setUser(user) {
        this.user = user;
        this.persistToStorage();
    }

    getUser() {
        return this.user;
    }
    
    loadUserFromBackend() {

        if (localStorage.getItem('aurelia_token') === null) {
            return new Promise((resolve) => {});
        }
        console.log("Got token, loading user");
       let userInfo = atob(localStorage.getItem('aurelia_token')).split(':');
       let username = userInfo[0];
       let password = userInfo[1];

        let db = new PouchDB(
            this.sharding.getRemoteUrl() + '_users',
            { 
                skipSetup: true,
                auth: {
                    "username": username,
                    "password": password
                },
                ajax: {
                    "withCredentials": false
                }
            }
        );

        console.log("Got DB");
        let me = this;

        return db.get(
            'org.couchdb.user:' + username,
            {
                include_docs: true
            }
        ).then(function (result) {
            me.user = result;
            me.persistToStorage();
            return result;
        }).catch(function (err) {
            console.log("Could not load user from backend" + err.status);
            log.error(err);
            if (err.status !== undefined && (err.status === 401 || err.status === 403)) {
                me.invalidate();
                throw err;
            }
            //do nothing, session is returned from storage
        });
       
    }

    invalidate() {
        this.user = null;
        localStorage.setItem('session', '{}');            
        this.auth.logout('#/login');
    }

    getLocale() {

        if (this.locale !== undefined) {
            return this.locale;
        }

        if (this.user !== undefined && this.user.preferred_locale !== undefined) {
            return this.user.preferred_locale;
        }
        
        return settings.default_locale;
    }

    switchLocale(locale) {
        this.locale = locale;
        this.setBaseUrl();
        this.i18n.setLocale(this.locale);

        this.persistToStorage();
        
        this.router.navigate(this.router.history.fragment, {replace:true});
    }

    impersonate(user) {
        if (this.isGranted('admin')) {
            if (this.realUser === undefined) {
                this.realUser = {
                    _id: this.user._id,
                    name: this.user.name,
                    roles: [ ...this.user.roles ]
                };
            }
            this.user = user;
        }
    }

    getToken() {
        return localStorage.getItem('aurelia_token');
    }

    isGranted(role) {
        if (this.user === undefined || this.user === null) {
            return false;
        }
        if (this.realUser !== undefined) {
            return this.realUser.roles.includes(role);            
        }
        return this.user.roles.includes(role);
    }
}