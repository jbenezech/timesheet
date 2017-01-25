import { inject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { Router } from 'aurelia-router';

@inject(Router)
export class TimesheetsRouter {

    constructor(router) {
        this.router = router;
    }

    configureRouter(config) {

        config.map([
            { 
                route: ['/'],
                name: 'list',
                moduleId: './timesheets',
                nav: false,
                title: 'List',
                auth: true
            },
            { 
                route: [':id'],
                name: 'timesheet',
                moduleId: './monthly-timesheet',
                nav: false,
                title: 'Timesheet',
                auth: true
            },
            { 
                route: ':timesheetId/:entryId',
                name: 'timesheetEntry',
                moduleId: './timesheet-entry',
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