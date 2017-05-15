import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { Session } from '../services/session';
import settings from '../config/app-settings';

@inject(Session, I18N)

/**
 * Router for the App once the user is logged in
 */
export class UserAppRouter {

    constructor(session, i18n) {    
        this.session = session;
        this.i18n = i18n;

        if (!this.session.isStarted()) {
            this.session.start();
        }

    }

    configureRouter(config, router) {

        let timesheets = { 
            route: ['timesheets'], 
            name: 'timesheets', 
            moduleId: 'pages/timesheets/timesheets-router', 
            nav: true, 
            auth: true
        };

        let planning = { 
            route: ['planning'], 
            name: 'planning', 
            moduleId: 'pages/timesheets/planning-router', 
            nav: true, 
            auth: true
        };

        let adminPlanning = { 
            route: ['admin'], 
            name: 'admin-planning', 
            moduleId: 'pages/admin/admin-router', 
            nav: true, 
            auth: true
        };

        let user = { 
            route: ['user'], 
            name: 'user', 
            moduleId: 'pages/user/user-router', 
            nav: false, 
            auth: true
        };

        let error = { 
            route: ['user'], 
            name: 'user', 
            moduleId: 'pages/user/user-router', 
            nav: false, 
            auth: true
        };

        let routes = [
            timesheets,
            planning,
            adminPlanning,
            user,
            error
        ];

        config.map(routes);

        this.router = router;

    }

    navigateToRoute(route, params) {
       this.router.navigate(route);
    }
}