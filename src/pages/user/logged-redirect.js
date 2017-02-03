import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

import { Session } from '../../services/session'
import { log } from '../../services/log';

@inject(Session, Router) 

/**
 * Landing after login to first start the session
 */
export class LoggedRedirect
{
    constructor(session, router) {
        this.session = session;
        this.router = router;
    }

    activate() {
        let router = this.router;
        this.session.start()
        .then(() => {
            router.navigate('app/timesheets');
        })
        .catch (function (err) {
            log.error(err);
        });
    }
}