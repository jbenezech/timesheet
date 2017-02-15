
import { inject, NewInstance, bindable } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { ValidationRules, ValidationController } from 'aurelia-validation';
import Decimal from 'decimal';

import { AdminRouter } from './admin-router';
import { DBService } from '../../services/db-service';

@inject(DBService, I18N, NewInstance.of(ValidationController), AdminRouter)

/**
 * VM for a single user timesheet
 */
export class UserTimesheet {

    @bindable timesheet = {};
    @bindable userName;
    @bindable purposes = new Map();
    @bindable unallocatedOnly;
    @bindable accountingRules;
    salary;

    constructor(db, i18n, controller, router) {
        this.db = db;
        this.i18n = i18n;
        this.controller = controller;
        this.router = router;
    }

    attached() {

        $('.' + this.userName + ' .precarite.checkbox').checkbox();
        if (this.timesheet.precarite) {
            $('.' + this.userName + ' .precarite.checkbox').checkbox('set checked');
        }

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

        this.saveTimesheet(userName);
    }

    allocationAdded(dropdown) {
        //add the newly added entry to all dropdowns on the page
        $('.user.timesheet dropdown').each( function() {
            this.au.controller.viewModel.entries = dropdown.entries;
        });
    }

    calculateRatios() {

        //calculate the ratio to apply to each entry based on the number of hours
        let totalHours = 0;
        this.timesheet.entries.forEach( (entry) => totalHours += entry.duration );
        this.timesheet.entries.forEach( (entry) => {
            entry.ratio = new Decimal(entry.duration).div(new Decimal(totalHours)).toJSON();
        });

    }

    saveTimesheet(userName) {

        let errors = this.controller.validate().then( result => {

            if (!result.valid) {
                return;
            }

            //manually update the timesheet as binding doesn't work with semantic checkbox
            this.timesheet.precarite = $('.' + this.userName + ' .precarite.checkbox').checkbox('is checked');

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