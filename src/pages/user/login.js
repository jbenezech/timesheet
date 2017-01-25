import {inject} from 'aurelia-framework';
import {AuthService} from 'aurelia-auth';
import {Router} from 'aurelia-router';
import {Session} from '../../services/session';
import settings from '../../config/app-settings';
import PouchDB from 'pouchdb';
import PouchDBAuthentication from 'pouchdb-authentication';

@inject(AuthService, Router, Session)

export class Login {

    constructor(auth, router, session){
        this.auth = auth;
        this.router = router;
        this.session = session;
        this.settings = settings;
    };
    
    login() {

        let login = this;
        
        PouchDB.plugin(PouchDBAuthentication);

        let db = new PouchDB('https://proacti.cloudant.com/timesheet-jerome', { skipSetup: true });
        db.login( this.username, this.password, function (err, response)  {

            console.log("RESPONSE:");
            console.log(response);
            if (err) {
                login.loginError = err.name;
                $('.ui.form .login.error.message').show();
                return;
            }

            localStorage.setItem('aurelia_token', btoa(login.username + ':' + login.password));
            login.router.navigate('loggedIn');
        });
    };

}