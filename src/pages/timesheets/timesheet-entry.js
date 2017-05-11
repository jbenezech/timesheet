
import { inject, NewInstance, bindable } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { ValidationRules, ValidationController } from 'aurelia-validation';
import moment from 'moment';
import { I18N } from 'aurelia-i18n';
import { FlashSuccessMessage } from '../../resources/flash/flash-success-message';

import settings from '../../config/app-settings';
import { TimesheetsRouter } from './timesheets-router';
import { Session } from '../../services/session';
import { DBService } from '../../services/db-service';

@inject(Element, Session, DBService, I18N, EventAggregator, TimesheetsRouter, NewInstance.of(ValidationController))

/**
 * VM to edit or create a timesheet entry
 */
export class TimesheetEntry {

    @bindable entity = {};

    @bindable create = false;
    @bindable saveAction;

    constructor(element, session, db, i18n, ea, router, controller) {
        this.element = element;
        this.session = session;
        this.db = db;
        this.i18n = i18n;
        this.ea = ea;
        this.router = router;
        this.controller = controller;
    }

    activate(params, routeConfig, navigationInstruction) {
        this.userName = this.session.getUser().name;

        //allow impersonification by admin
        if (
            navigationInstruction.queryParams.u !== undefined &&
            this.session.isGranted('admin')
        ) {
            this.userName = navigationInstruction.queryParams.u;
        }

        this.redirectTo = navigationInstruction.queryParams.r;
        if (params.timesheetId && params.entryId) {
            this.getTimesheetEntry(params.timesheetId, params.entryId)
        }
    }

    attached() {
        
        if ( ! this.entity.id ) {
            this.entity.date = new Date();
            this.entity.hours = 0;
            this.entity.minutes = 0;
            this.entity.interpret_hours = 0;
            this.entity.interpret_minutes = 0;
        }
        this.setDate();
        this.setupValidation();

    }

    setDate() {
        let me = this;

        $(this.element).find('.date.ui.calendar').each(function() {
            $(this).calendar({
                type: 'date',
                formatInput: false,
                text: settings.calendar_text
            });

            $(this).calendar(
                'set date',
                new Date(me.entity.date)
            );
        });        
    }

    get isEditable() {
        return this.session.isGranted('admin') || 
            this.entity.allocation === undefined ||
            this.entity.allocation === null
        ;
    }

    setupValidation() {

        ValidationRules.customRule(
            'timeIsSet',
            (value, obj) => parseInt(obj.minutes) > 0 || parseInt(value) > 0,
            this.i18n.tr('time_not_set') 
        );

        let me = this;
        if (! this.create ) {
            //An entry already created cannot be moved to a different month
            ValidationRules.customRule(
                'monthUnchanged',
                (value, obj) => me.isMonthUnChanged()
                ,
                this.i18n.tr('month_changed') 
            );

            ValidationRules
                .ensure('dateInput').satisfiesRule('monthUnchanged')
                .ensure('date').satisfiesRule('monthUnchanged')
                .on(this);
        }

        ValidationRules
            .ensure('date').required()      
            .ensure('purpose').required()
            .ensure('hours').required()
                .matches(/^[\d]+$/).withMessage(this.i18n.tr('error_number'))
                .then()
                .satisfiesRule('timeIsSet').when(entry => parseInt(entry.minutes) === 0)
            .ensure('minutes').required().matches(/^[\d]+$/).withMessage(this.i18n.tr('error_number'))
            .ensure('interpret_hours').matches(/^[\d]*$/).withMessage(this.i18n.tr('error_number'))
            .ensure('interpret_minutes').matches(/^[\d]*$/).withMessage(this.i18n.tr('error_number'))
            .on(this.entity);
    }

    isMonthUnChanged() {
        return this.entity.date === null || this.entity.date === undefined || 
            new Date(this.entity.date).getMonth() === 
            this.getCalendarDate().getMonth()
        ;
    }

    getCalendarDate() {
        return new Date($(this.element).find('.date.ui.calendar').calendar('get date'));
    }

    getTimesheetEntry(timesheetId, entryId) {
        let me = this;
        return this.db.get('timesheet-' + this.userName,  timesheetId)
        .then( response => {
            response.entries.map( (entry) => {       
                if (entry.id === entryId) {
                    me.entity = entry;
                }
            });

            me.setDate();
            return new Promise((resolve) => { resolve(); });
        }); 
    }

    doSave(event) {

        let errors = this.controller.validate().then( result => {

            //no error message, save button should not be available 
            if (!this.isEditable) {
                return;
            }
            
            if (!result.valid) {
                return;
            }

            //manually edit as binding won't work with semantic calendar
            this.entity.date = this.getCalendarDate();

            if (this.create) {
                this.entity.id = this.entity.purpose + ':' + Date.now();
            }

            this.entity.hours = parseInt(this.entity.hours);
            this.entity.minutes = parseInt(this.entity.minutes);
            this.entity.interpret_hours = parseInt(this.entity.interpret_hours);
            this.entity.interpret_minutes = parseInt(this.entity.interpret_minutes);
            this.entity.duration = this.entity.hours + parseFloat(this.entity.minutes/60);
            this.entity.interpret_duration = this.entity.interpret_hours + parseFloat(this.entity.interpret_minutes/60);

            let timesheetId = moment(this.entity.date).format('YYYY-MM');
            
            //get the timesheet document
            this.db.get('timesheet-' + this.userName, timesheetId).then( timesheet => {

                if (! timesheet._id ) {
                    timesheet = {
                        _id: timesheetId,
                        entries: []
                    }
                }
                
                //if entry already exists, remove it first
                //traverese the array reverse to remove entries
                let entry = this.entity;
                timesheet.entries.slice().reverse().forEach(function(item, index, object) {
                    if (item.id === entry.id) {
                        timesheet.entries.splice(object.length - 1 - index, 1);
                    }
                });

                timesheet.entries = [
                    this.entity,
                    ...timesheet.entries
                ];

                this.db.save('timesheet-' + this.userName, timesheet).then( () =>
                    this.ea.publish(new FlashSuccessMessage(this.i18n.tr('success')))
                );
            
                if (this.create) {
                    //reset entity for new entry
                    this.entity = {
                        purpose: this.entity.purpose,
                        hours: 0,
                        minutes: 0,
                        interpret_hours: 0,
                        interpret_minutes: 0
                    };

                    this.setupValidation();
                }

                if (this.saveAction) {
                    this.saveAction({ entity: this.entity});
                }

                if (this.redirectTo) {
                    this.router.navigateToRoute(this.redirectTo);
                }
            });
            
        });
        
    }
}