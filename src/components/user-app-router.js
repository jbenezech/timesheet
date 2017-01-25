import { inject } from 'aurelia-framework';
import { Session } from '../services/session';
import { I18N } from 'aurelia-i18n';
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

        let timesheets =
            { 
            route: ['timesheets'], 
            name: 'timesheets', 
            moduleId: 'pages/timesheets/timesheets-router', 
            nav: true, 
            title: 'nav.timesheets', 
            settings: { 'icon': 'feed' } ,
            auth: true
            };

        let planning =
            { 
            route: ['planning'], 
            name: 'planning', 
            moduleId: 'pages/timesheets/planning-router', 
            nav: true, 
            title: 'nav.planning', 
            settings: { 'icon': 'calendar' } ,
            auth: true
            };

        let adminPlanning =
            { 
            route: ['admin'], 
            name: 'admin-planning', 
            moduleId: 'pages/admin/admin-router', 
            nav: true, 
            title: 'nav.planning', 
            settings: { 'icon': 'percent' } ,
            auth: true
            };

        let user =
            { 
            route: ['user'], 
            name: 'user', 
            moduleId: 'pages/user/user-router', 
            nav: false, 
            title: 'nav.user', 
            settings: { 'icon': 'users' } ,
            auth: true
            };

        let routes = [
            ...timesheets,
            ...planning,
            ...adminPlanning,
            ...user
        ];

        config.map(routes);

        this.router = router;

    }


    configureFakeRouter(config, router) {

        let announcements =
            { 
            route: ['announcements'], 
            name: 'announcements', 
            moduleId: 'pages/announcements/announcements-router', 
            nav: true, 
            title: 'nav.announcements', 
            settings: { 'icon': 'feed' } ,
            auth: true
            };

        let organizations =
            { 
            route: ['organizations'], 
            name: 'organizations', 
            moduleId: 'pages/organizations/organizations-router', 
            nav: false, 
            title: 'nav.organizations', 
            settings: { 'icon': 'users' } ,
            auth: true
            };

        return [
            ...announcements,
            ...organizations
        ];

    }

    configureCommonRouter(config, router) {

        let announcements =
            { 
            route: ['announcements'], 
            name: 'announcements', 
            moduleId: 'pages/announcements/announcements-router', 
            nav: true, 
            title: 'nav.announcements', 
            settings: { 'icon': 'feed' } ,
            auth: true
            };

        let organizations =
            { 
            route: ['organizations'], 
            name: 'organizations', 
            moduleId: 'pages/organizations/organizations-router', 
            nav: false, 
            title: 'nav.organizations', 
            settings: { 'icon': 'users' } ,
            auth: true
            };

        let user =
            { 
            route: ['user'], 
            name: 'user', 
            moduleId: 'pages/user/user-router', 
            nav: false, 
            title: 'nav.user', 
            settings: { 'icon': 'users' } ,
            auth: true
            };

        return [
            ...announcements,
            ...organizations,
            ...user
        ];

    }

    configureFORouter(config, router) {

        return this.configureCommonRouter(config, router);
        
    }

    configureMillerRouter(config, router) {

        let routes = this.configureCommonRouter( config, router);

         let userFilters =
            { 
            route: ['user-filters'], 
            name: 'userFilters', 
            moduleId: 'pages/user-filters/filters-router', 
            nav: true, 
            title: 'nav.filters', 
            settings: { 'icon': 'filter'} ,
            auth: true
            };

        let notifications =
            { 
            route: ['notifications'], 
            name: 'notifications', 
            moduleId: 'pages/notifications/notifications-router', 
            nav: true, 
            title: 'nav.notifications', 
            settings: { 'icon': 'mail outline' } ,
            auth: true
            };

        return [
            ...routes,
            userFilters,
            ...notifications
        ];

    }

    configureFFORouter(config, router) {

        return this.configureFORouter( config, router);

    }

    configurePublicRouter(config, router) {

        return this.configureFORouter( config, router);

    }

}