import { inject, singleton } from 'aurelia-framework';
import { RouteLoader } from './route-loader';
import { Router } from 'aurelia-router';
import { AuthService } from 'aurelia-auth';
import {I18N} from 'aurelia-i18n';
import settings from '../config/app-settings';
import {HttpClient} from 'aurelia-fetch-client';
import PouchDB from 'pouchdb';

@singleton()
@inject(RouteLoader, Router, AuthService, I18N, HttpClient)
export class Session {

    constructor(loader, router, auth, i18n, http) {
        this.loader = loader;
        this.router = router;
        this.auth = auth;
        this.i18n = i18n;
        this.http = http;

        this.loadFromStorage();
        this.locale = this.getLocale();
        this.i18n
            .setLocale(this.locale);

        this.started = false;

        this.setBaseUrl();
    }

    start() {
        let me = this;

        return this.loadUserFromBackend().then( () => {

            me.started = true;
            return true;
            
        }).catch (function (err) {
            console.log(err);
        });
    }

    setBaseUrl() {
        settings.baseUrl = 
            settings.rootUrl + 
            settings.envUrlPrefix +
            '/' + 
            this.locale + 
            '/' + 
            'api/'
        ;    
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
    
    userHasRole(role) {
        return this.user !== undefined && this.user !== null && this.user.roles.includes(role);
    }

    loadUserFromBackend() {

        if (localStorage.getItem('aurelia_token') === null) {
            return new Promise((resolve) => {});
        }

       let userInfo = atob(localStorage.getItem('aurelia_token')).split(':');
       let username = userInfo[0];
       let password = userInfo[1];

        let db = new PouchDB(
            'https://proacti.cloudant.com/_users',
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
            console.log(err);
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
        this.http.configure(config => {
            config
                .withBaseUrl(settings.baseUrl)
        });
        this.persistToStorage();
        
        this.loader.invalidateCache();

        this.router.navigate(this.router.history.fragment, {replace:true});
    }

    getToken() {
        return localStorage.getItem('aurelia_token');
    }

    isGranted(role) {
        if (this.user === undefined) {
            return false;
        }
        return this.user.roles.includes(role);
    }
}