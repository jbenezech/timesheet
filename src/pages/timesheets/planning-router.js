import { inject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';

@inject(HttpClient)
export class PlanningRouter {

   configureRouter(config, router) {

        config.map([
            { 
                route: ['/'],
                name: 'planning',
                moduleId: './planning',
                nav: false,
                title: 'Planning',
                auth: true
            },
        ]);
        this.router = router;
    }

    navigateToRoute(route, params) {
       this.router.navigate(route);
    }

}