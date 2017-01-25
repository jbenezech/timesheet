import { HttpClient } from 'aurelia-fetch-client';
import { inject } from 'aurelia-framework';
import {Container} from 'aurelia-dependency-injection';
import {I18N} from 'aurelia-i18n';
import {AuthorizeStep, AuthService, FetchConfig} from 'aurelia-auth';
import { EventAggregator } from 'aurelia-event-aggregator';
import { FlashErrorMessage } from './resources/flash/flash-error-message';
import settings from './config/app-settings';
import { Session} from './services/session';

@inject(I18N, FetchConfig, AuthService, HttpClient, EventAggregator, Session)
export class App {

    constructor(i18n, fetchConfig, authService, httpClient, aggregator, session) {
    
        this.i18n = i18n;
        this.fetchConfig = fetchConfig;
        this.authService = authService;
        this.httpClient = httpClient;
        this.ea = aggregator;
        this.session = session;

    }

    activate() {
    
        let ea = this.ea;
        let i18n = this.i18n;

        this.httpClient.configure(config => {
        config
            .useStandardConfiguration()
            .withBaseUrl(settings.baseUrl)
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
                    ea.publish(new FlashErrorMessage(i18n.tr(response.statusText)));
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
        config.title = 'Timeflies';

        config.addPipelineStep('authorize', AuthorizeStep);
        let userApp = {
            route: ['app'], 
            name: 'home', 
            moduleId: 'components/user-app-router', 
            nav: false, 
            title: 'Home',
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
