import { inject } from 'aurelia-framework';

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