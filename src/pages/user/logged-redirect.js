import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Session } from '../../services/session'

@inject(Session, Router) 
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
            console.log(err);
        });
    }
}