
import { BindingEngine, inject, NewInstance, bindable, observable } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { AdminRouter } from './admin-router';
import { Session } from '../../services/session';
import { DBService } from '../../services/db-service';
import settings from '../../config/app-settings';
import moment from 'moment';
import { I18N } from 'aurelia-i18n';
import {ValidationRules, ValidationController} from 'aurelia-validation';
import Decimal from 'decimal';

@inject(Element, Session, DBService, I18N, EventAggregator, BindingEngine, NewInstance.of(ValidationController), AdminRouter)
export class UserTimesheet {

    @bindable timesheet = {};
    @bindable userName;
    @bindable purposes = new Map();
    @bindable unallocatedOnly;
    salary;

    constructor(element, session,db, i18n, ea, bindingEngine, controller, router) {
        this.element = element;
        this.session = session;
        this.db = db;
        this.i18n = i18n;
        this.ea = ea;
        this.bindingEngine = bindingEngine;
        this.controller = controller;
        this.router = router;
    }

    attached() {

        ValidationRules
            .ensure('salary').required()
            .matches(/^[\d]+[\.|]?[\d]*$/).withMessage(this.i18n.tr('error_number'))
            .on(this.timesheet);

    }

    allocationSelected(dropdown) {
        let userName = dropdown.element.dataset.username;

        //manually update the entry as binding doesn't seem to work on the internal data array        
        this.timesheet.entries.forEach( (entry) => {
            if (entry.id === dropdown.element.dataset.entryid) {
                entry.allocation = dropdown.selectedEntry;
            }
        });

        this.calculateRatios();

        this.saveTimesheet();
    }

    allocationAdded(dropdown) {
        //add the newly added entry to all dropdowns on the page
        $('.user.timesheet dropdown').each( function() {
            this.au.controller.viewModel.entries = dropdown.entries;
        })
    }

    calculateRatios() {

        let totalHours = 0;
        this.timesheet.entries.forEach( (entry) => totalHours += entry.duration );
        this.timesheet.entries.forEach( (entry) => {
            entry.ratio = new Decimal(entry.duration).div(new Decimal(totalHours)).toJSON();
        });

    }

    saveTimesheet() {

        let errors = this.controller.validate().then( result => {

            if (!result.valid) {
                return;
            }

            //save and retrieve the latest revision of the timesheet for that user
            this.db.save('timesheet-' + this.userName, this.timesheet).then( () => {
                this.db.get('timesheet-' + this.userName, this.timesheet._id).then( (response) => {
                    this.timesheet._rev = response._rev;
                });
            });

        });
    }

    openEntry(id) {
        this.router.navigateToRoute('timesheets/' + this.timesheet._id + '/' + id + '?r=admin/' + this.timesheet._id);
    }
}