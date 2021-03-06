import { inject } from 'aurelia-framework';

export class UserRouter {

   configureRouter(config, router) {

        config.map([
            { 
                route: ['/password'],
                name: 'password',
                moduleId: './password',
                nav: true,
                title: 'user:change_password',
                settings: { 'icon': 'unlock' }
            }
        ]);
        this.router = router;
    }

    navigateToRoute(route, params) {
       this.router.navigate(route);
    }

}