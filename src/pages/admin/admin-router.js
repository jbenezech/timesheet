import { inject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { Router } from 'aurelia-router';

@inject(Router)
export class AdminRouter {

    constructor(router) {
        this.router = router;
    }

    configureRouter(config) {

        config.map([
            { 
                route: ['/', 'planning'],
                name: 'planning',
                moduleId: './planning',
                nav: false,
                title: 'Planning',
                auth: true
            },
            { 
                route: ':month',
                name: 'panel',
                moduleId: './admin-panel',
                nav: false,
                title: 'Timesheet',
                auth: true
            }
        ]);
        
    }

    navigateToRoute(route, params) {
       this.router.navigate(route);
    }

}