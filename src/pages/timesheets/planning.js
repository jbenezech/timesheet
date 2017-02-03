
import { inject, NewInstance, bindable, observable } from 'aurelia-framework';
import moment from 'moment';

import { TimesheetsRouter } from './timesheets-router';
import settings from '../../config/app-settings';

@inject(Element, TimesheetsRouter)
export class Planning {

    constructor(element, router) {
        this.element = element;
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