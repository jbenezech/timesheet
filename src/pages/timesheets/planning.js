
import { inject, NewInstance, bindable, observable } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { EventAggregator } from 'aurelia-event-aggregator';
import { TimesheetsRouter } from './timesheets-router';
import { Session } from '../../services/session';
import { DBService } from '../../services/db-service';
import settings from '../../config/app-settings';
import moment from 'moment';
import { I18N } from 'aurelia-i18n';

@inject(Element, Session, DBService, I18N, TimesheetsRouter)
export class Planning {

    constructor(element, session, db, i18n, router) {
        this.element = element;
        this.session = session;
        this.db = db;
        this.i18n = i18n;
        this.router = router;
    }

    attached() {
        let me = this;
        $(this.element).find('.ui.calendar').calendar({
            type: 'month',
            inline: true,
            text: settings.calendar_text,
            onChange: function(date, text) {
                let timesheetId = moment(date).format('YYYY-MM');
                me.router.navigateToRoute('app/timesheets/' + timesheetId);
            }
        });
    }
}