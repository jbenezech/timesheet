import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { I18N } from 'aurelia-i18n';

@inject(Router, I18N)
export class TimesheetsRouter {

    constructor(router, i18n) {
        this.router = router;
        this.i18n = i18n;
    }

    configureRouter(config) {

        config.map([
            { 
                route: ['/'],
                name: 'entry',
                moduleId: './timesheets',
                nav: false,
                title: this.i18n.tr('timesheetentry'),
                auth: true
            },
            { 
                route: [':id'],
                name: 'timesheet',
                moduleId: './monthly-timesheet',
                nav: false,
                title: this.i18n.tr('monthtimesheet'),
                auth: true
            },
            { 
                route: ':timesheetId/:entryId',
                name: 'timesheetEntry',
                moduleId: './timesheet-entry',
                nav: false,
                title: this.i18n.tr('timesheetentry'),
                auth: true
            }
        ]);
        
    }

    navigateToRoute(route, params) {
       this.router.navigate(route);
    }

}