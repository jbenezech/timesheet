import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import PouchDB from 'pouchdb';

import PouchDBAuthentication from 'pouchdb-authentication';
import { log } from '../../services/log';
import { ShardingService } from '../../services/sharding-service';

@inject(ShardingService, Router)

/**
 * VM for login. Authenticates against remote database
 */
export class Login {

    constructor(sharding, router){
        this.sharding = sharding;
        this.router = router;
    };
    
    login() {

        let me = this;
        
        PouchDB.plugin(PouchDBAuthentication);

        let db = new PouchDB(this.sharding.getRemoteUrl() + '_users', { skipSetup: true });
        db.login( this.username, this.password, function (err, response)  {

            if (err) {
                log.error(err);
                me.loginError = err.name;
                $('.ui.form .login.error.message').show();
                return;
            }

            localStorage.setItem('aurelia_token', btoa(me.username + ':' + me.password));
            me.router.navigate('loggedIn');
        });
    };

}