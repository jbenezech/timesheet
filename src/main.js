import { HttpClient } from 'aurelia-fetch-client';
import { EventAggregator } from 'aurelia-event-aggregator';
import { I18N } from 'aurelia-i18n';
import Backend from 'i18next-xhr-backend';
import semanticui from 'semantic';
import semanticuicalendar from 'semantic-calendar/calendar';
import { LogManager } from 'aurelia-framework';
import { ConsoleAppender } from 'aurelia-logging-console';

import { SemanticFormValidationRenderer } from 'lib/form/semantic-form-validation-renderer';
import settings from './config/app-settings';

LogManager.addAppender(new ConsoleAppender());
LogManager.setLevel(LogManager.logLevel.debug);

export function configure(aurelia) {

    //disable warnings from bluebird poluting the console
    //https://github.com/aurelia/skeleton-navigation/issues/282
    //https://www.jujens.eu/posts/en/2016/Aug/17/switch-to-aurelia-cli/
    Promise.config({
        longStackTraces: false,
        warnings: false,
    });

    aurelia.use
    .standardConfiguration()
    .developmentLogging()

    .plugin("aurelia-dialog")
    .plugin('aurelia-validation')
    .plugin('aurelia-i18n', (instance) => {
        
        instance.i18next.use(Backend);

        //below settings needed to support en-US locales (with - in name)
        instance.i18next.options.load = 'currentOnly';
        instance.i18next.options.lowerCaseLng = false;
        instance.i18next.options.cleanCode = false;

        return instance.setup({
            resGetPath : 'locales/__lng__/__ns__.json',
            lngs: ['fr-FR'],
            fallbackLng : settings.default_locale,
            debug: settings.debug,
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
