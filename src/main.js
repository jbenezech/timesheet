import { HttpClient } from 'aurelia-fetch-client';
import { EventAggregator } from 'aurelia-event-aggregator';
import { I18N } from 'aurelia-i18n';
import semanticui from 'semantic';
import semanticuicalendar from 'semantic-calendar/calendar';
import { FlashErrorMessage } from 'resources/flash/flash-error-message';
import { SemanticFormValidationRenderer } from 'lib/form/semantic-form-validation-renderer';
import config from './config/auth-config';
import settings from './config/app-settings';
import PouchDB from 'pouchdb';

import {LogManager} from 'aurelia-framework';
import {ConsoleAppender} from 'aurelia-logging-console';

LogManager.addAppender(new ConsoleAppender());
LogManager.setLevel(LogManager.logLevel.debug);

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()

  //Uncomment the line below to enable animation.
  //aurelia.use.plugin('aurelia-animator-css');
  //if the css animator is enabled, add swap-order="after" to all router-view elements

  //Anyone wanting to use HTMLImports to load views, will need to install the following plugin.
  //aurelia.use.plugin('aurelia-html-import-template-loader')

    .plugin("aurelia-dialog")
    .plugin('aurelia-i18n', (instance) => {
        
        //instance.i18next.use(Backend);

        //below settings needed to support en-US locales (with - in name)
        instance.i18next.options.load = 'currentOnly';
        instance.i18next.options.lowerCaseLng = false;
        instance.i18next.options.cleanCode = false;

        return instance.setup({
            //backend: {                                  
            //    loadPath: settings.baseUrl + '/{{lng}}/api/translations/{{ns}}.json',
            //},
            lngs: ['en-US', 'km-KH'],
            fallbackLng : settings.default_locale,
            debug: false,//settings.debug,
            //ns: ['translation', 'announcement', 'organization', 'user'],
            ns: ['translation'],
            defaultNs: 'translation'
        });
    })
    //.plugin('aurelia-validatejs')
    .plugin('aurelia-validation')
    .plugin('aurelia-auth', (baseConfig) => {
        baseConfig.baseUrl = settings.baseUrl;
        baseConfig.configure(config);
    });
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
