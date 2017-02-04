import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { I18N } from 'aurelia-i18n';

@inject(Router, I18N)
export class AdminRouter {

    constructor(router, i18n) {
        this.router = router;
        this.i18n = i18n;
    }

    configureRouter(config) {

        config.map([
            { 
                route: ['/', 'planning'],
                name: 'planning',
                moduleId: './planning',
                nav: false,
                title: this.i18n.tr('planning'),
                auth: true
            },
            { 
                route: ':month',
                name: 'panel',
                moduleId: './admin-panel',
                nav: false,
                title: this.i18n.tr('budgetting'),
                auth: true
            }
        ]);
        
    }

    navigateToRoute(route, params) {
       this.router.navigate(route);
    }

}