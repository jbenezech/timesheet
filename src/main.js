import { HttpClient } from 'aurelia-fetch-client';
import { EventAggregator } from 'aurelia-event-aggregator';
import { I18N } from 'aurelia-i18n';
import semanticui from 'semantic';
import semanticuicalendar from 'semantic-calendar/calendar';
import PouchDB from 'pouchdb';

import { LogManager } from 'aurelia-framework';
import { ConsoleAppender } from 'aurelia-logging-console';

import { SemanticFormValidationRenderer } from 'lib/form/semantic-form-validation-renderer';
import settings from './config/app-settings';

LogManager.addAppender(new ConsoleAppender());
LogManager.setLevel(LogManager.logLevel.debug);

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()

    .plugin("aurelia-dialog")
    .plugin('aurelia-validation')
    .plugin('aurelia-i18n', (instance) => {
        
        //below settings needed to support en-US locales (with - in name)
        instance.i18next.options.load = 'currentOnly';
        instance.i18next.options.lowerCaseLng = false;
        instance.i18next.options.cleanCode = false;

        return instance.setup({
            lngs: ['en-US', 'fr-FR'],
            fallbackLng : settings.default_locale,
            debug: settings.debug,
            //ns: ['translation', 'announcement', 'organization', 'user'],
            ns: ['translation'],
            defaultNs: 'translation'
        });
    })
    ;

    configureContainer(aurelia.container);

    aurelia.start().then(() => {
        aurelia.setRoot()
    });
}


function configureContainer(container) {
    let http = new HttpClient();
    
    container.registerInstance(HttpClient, http);
    //container.registerInstance(HttpClient, httpMock);

    container.registerHandler(
        'semantic-form',
        container => container.get(SemanticFormValidationRenderer));  
}
