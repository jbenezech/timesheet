import { inject, NewInstance, bindable, containerless } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import { EventAggregator } from 'aurelia-event-aggregator';
import { ValidationRules, ValidationController } from 'aurelia-validation';
import { I18N } from 'aurelia-i18n';
import { UserRouter } from './user-router';
import { Session } from '../../services/session';
import settings from '../../config/app-settings';
import { FlashSuccessMessage } from '../../resources/flash/flash-success-message';

@inject(Element, Session, I18N, HttpClient, UserRouter, EventAggregator, NewInstance.of(ValidationController))
export class Password {   

    form = {};

    constructor(element, session, i18n, http, router, ea, controller) {        
        this.element = element;
        this.session = session;
        this.i18n = i18n;
        this.http = http;
        this.router = router;
        this.ea = ea;
        this.controller = controller;

        this.form = {
            current_password: null,
            plain_password: {
                first: null,
                second: null
            }
        };
    }
    
    activate() {

        this.rules = ValidationRules
            .ensure('current_password').required({ message: "required" })
            .on(this.form)
        ; 

        this.newrules = ValidationRules
            .ensure('first').required().length({ minimum: 6 })
            .ensure('second').required()
            .ensure('first').equality('second')
            .on(this.form.plain_password)
        ;        
    }

    save(event) {

        let errors = this.controller.validate();

        if (errors.length > 0) {
            return;
        }

        $(event.target).addClass('loading');

        return this
            .http.fetch(
                'users/' + this.session.user.id + '/password',
                {
                    method: 'PUT',
                    body: json(this.form)
                }
            )
            .then(response => {
                
                $(event.target).removeClass('loading');

                if (response instanceof Error) {
                    Promise.reject(response);
                    return response;
                }

                this.ea.publish(new FlashSuccessMessage(this.i18n.tr('success')));
                this.form = {
                    current_password: null,
                    plain_password: {
                        first: null,
                        second: null
                    }
                };
                return new Promise((resolve) => { resolve(); });
            })
            .catch( () => {} )
        ;
    }
}

