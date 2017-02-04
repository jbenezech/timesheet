import { HttpClient } from 'aurelia-fetch-client';
import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { AuthorizeStep } from 'aurelia-auth';

@inject(I18N, HttpClient)
export class App {

    constructor(i18n, httpClient) {
        this.i18n = i18n;
        this.httpClient = httpClient;
    }

    activate() {
    
        let i18n = this.i18n;

        this.httpClient.configure(config => {
        config
            .useStandardConfiguration()
            .withDefaults({
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'Fetch'
            }
            })
            .withInterceptor({
                request(request) {
                    return request;
                },
                response(response) {
                    return response;
                },
                responseError(response) {
                    console.log(response);
                    return new Error(response.statusText);
                }
            })
            .withInterceptor({
                request(request) {
                    request.headers.append('Authorization', 'Basic ' + localStorage.getItem('aurelia_token'));
                    return request;
                }
            })
            ;
        });
    }


    configureRouter(config, router) {
        config.title = 'Ruelle';

        config.addPipelineStep('authorize', AuthorizeStep);
        let userApp = {
            route: ['app'], 
            name: 'home', 
            moduleId: 'components/user-app-router', 
            nav: false, 
            auth: true  
        };

        let loggedIn = {
            route: ['loggedIn'], 
            name: 'Logged', 
            moduleId: 'pages/user/logged-redirect', 
            nav: false, 
            title: 'Logged',
            auth: true  
        };

        config.map([
            { route: ['login'], name: 'login', moduleId: 'pages/user/login', nav: false, title: 'Login', authRoute: true },
            { route: '', redirect: 'loggedIn' },
            ...userApp,
            ...loggedIn
        ]);

        this.router = router;
    }
}
