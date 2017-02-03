import {inject} from 'aurelia-framework';
import {AuthService} from 'aurelia-auth';
import {Router} from 'aurelia-router';
import {Session} from '../../services/session';
import settings from '../../config/app-settings';
import PouchDB from 'pouchdb';
import PouchDBAuthentication from 'pouchdb-authentication';
import { log } from '../../services/log';
import { ShardingService } from '../../services/sharding-service';

@inject(AuthService, ShardingService, Router, Session)

export class Login {

    constructor(auth, sharding, router, session){
        this.auth = auth;
        this.sharding = sharding;
        this.router = router;
        this.session = session;
        this.settings = settings;
    };
    
    login() {

        let login = this;
        
        PouchDB.plugin(PouchDBAuthentication);

        let db = new PouchDB(this.sharding.getRemoteUrl() + '_users', { skipSetup: true });
        db.login( this.username, this.password, function (err, response)  {

            if (err) {
                log.error(err);
                login.loginError = err.name;
                $('.ui.form .login.error.message').show();
                return;
            }

            localStorage.setItem('aurelia_token', btoa(login.username + ':' + login.password));
            login.router.navigate('loggedIn');
        });
    };

}