import { inject, singleton } from 'aurelia-framework';
import { Session} from './session';
import PouchDB from 'pouchdb';
import moment from 'moment';
import { EventAggregator } from 'aurelia-event-aggregator';
import { HttpClient } from 'aurelia-fetch-client';
import settings from '../config/app-settings';

@inject(Session, HttpClient, EventAggregator)
@singleton()
export class HTTPService {

    constructor(session, http, ea) {
        this.session = session;
        this.http = http;
        this.ea = ea;

        this.configure();
    }

    configure() {
        this.http.configure(config => {
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
                    let authHeader = fakeAuthService.getAuthHeaderValue(request.url);
                    request.headers.append('Authorization', authHeader);
                    return request;
                }
            })
            ;
        });
    }

    fetch(url) {
         return this.http.fetch(url)
        .then(response => response.json())
        .then(users => {
            return users;
        })
    }

}