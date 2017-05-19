
import { inject, NewInstance, bindable } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { ValidationRules, ValidationController, validateTrigger } from 'aurelia-validation';
import Decimal from 'decimal';

import { AdminRouter } from './admin-router';
import { DBService } from '../../services/db-service';

@inject(Element, DBService, I18N, NewInstance.of(ValidationController), AdminRouter)

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

    constructor(element, db, i18n, controller, router) {
        this.element = element;
        this.db = db;
        this.i18n = i18n;
        this.controller = controller;
        this.router = router;
        this.controller.validateTrigger = validateTrigger.manual;
    }

    attached() {

        $('.' + this.userName + ' .precarite.checkbox').checkbox();
        if (this.timesheet.precarite) {
            $('.' + this.userName + ' .precarite.checkbox').checkbox('set checked');
        }

        ValidationRules.customRule(
            'maxHoursIsValid',
            (value, obj) => this.maxHoursIsValid()
            ,
            this.i18n.tr('error_hoursleft') 
        );

        ValidationRules.customRule(
            'hasHoursLeftToAllocate',
            (value, obj) => {
                if (
                    this.timesheet.maxhours === undefined ||
                    this.timesheet.maxhours === null ||
                    this.timesheet.maxhours === ''
                ) {
                    return true;
                }

                if (!this.maxHoursIsValid()) {
                    return false;
                }
                
                let totalHours = this.getTotalAllocatedHours();
                let hoursLeft = new Decimal(this.timesheet.maxhours).sub(totalHours);
                if (hoursLeft.isZero()) {
                    return false;
                }
                return true;
            }
            ,
            this.i18n.tr('error_hoursleft') 
        );

        this.rules = ValidationRules
            .ensure('salary').required()
            .matches(/^[\d]+[\.|]?[\d]*$/).withMessage(this.i18n.tr('error_number'))
            .ensure('maxhours')
                .matches(/^([\d]+[\.|]?[\d]*)?$/).withMessage(this.i18n.tr('error_number'))
                .then()
                .satisfiesRule('maxHoursIsValid')
            .on(this.timesheet)
            .rules;

        this.allocationRules = ValidationRules
            .ensure('maxhours')
            .satisfiesRule('hasHoursLeftToAllocate')
            .on(this.timesheet)
            .rules;

    }

    maxHoursIsValid() {
        if (
            this.timesheet.maxhours === undefined ||
            this.timesheet.maxhours === null ||
            this.timesheet.maxhours === ''
        ) {
            return true;
        }

        let totalHours = this.getTotalAllocatedHours();
        let hoursLeft = new Decimal(this.timesheet.maxhours).sub(totalHours);
        return hoursLeft.greaterThanOrEqualTo(new Decimal(0));
    }

    getTotalAllocatedHours() {
        let totalHours = new Decimal(0);
        if (this.timesheet.entries === undefined) {
            return totalHours;
        }
        this.timesheet.entries.forEach( (entry) => {
            if (entry.allocation !== undefined) {
                totalHours = totalHours.add(new Decimal(entry.duration));
            }

        });

        return totalHours;
    }

    allocationSelected(dropdown) {
        let userName = dropdown.element.dataset.username;
        
        //manually update the entry as dropdown gets detached before this action (and addAction)
        //are called if using two way binding
        let allocatedEntry = null;
        let newAllocation = null;
        this.timesheet.entries.forEach( (entry) => {            
            if (entry.id === dropdown.element.dataset.entryid) {
                newAllocation = dropdown.selectedEntry;
                allocatedEntry = entry;
            }
        });

        //if nothing has changed, exit
        if (allocatedEntry.allocation === newAllocation) {
            return;
        }

        let promise = this.getAllocationValidation(allocatedEntry, newAllocation);

        promise.then(result => {

            if (!result.valid) {
                dropdown.restoreDefaults();
                return;
            }

            this.saveTimesheet(userName, allocatedEntry, newAllocation);
        });


    }

    getAllocationValidation(allocatedEntry, allocation) {

        this.controller.reset();

        let promise = new Promise( (resolve) => resolve({ valid: true, isAllocation: false }) );

        //first if entry is being allocated, verify it's valid
        if (
            allocatedEntry !== null &&
            allocatedEntry !== undefined &&
            allocatedEntry.allocation === undefined
        ) {
            promise = this.controller.validate({ object: this.timesheet, rules: this.allocationRules })
            .then ( result => {
                result.isAllocation = true;
                return new Promise( (resolve) => resolve(result) );
            })
        }

        return promise;

    }

    allocationAdded(dropdown) {
        //add the newly added entry to all dropdowns on the page
        $('.user.timesheet dropdown').each( function() {
            this.au.controller.viewModel.entries = dropdown.entries;
        });
    }

    calculateRatios() {

        //calculate the ratio to apply to each entry based on the number of hours
        let totalHours = this.getTotalAllocatedHours();
        
        if (this.timesheet.entries === undefined) {
            return;
        }

        this.timesheet.entries.forEach( (entry) => {
            entry.ratio = 0;
            if (entry.allocation !== undefined) {
                entry.ratio = new Decimal(entry.duration).div(new Decimal(totalHours)).toJSON();
            }
        });

    }

    saveTimesheet(userName, allocatedEntry, allocation) {

        let promise = this.getAllocationValidation(allocatedEntry, allocation);

        promise.then(result => {

            if (!result.valid) {
                return {
                    valid: false
                };
            }

            return this.controller.validate({ object: this.timesheet, rules: this.rules });
        
        }).then( result => {

            if (!result.valid) {
                return;
            }

            if (
                allocatedEntry !== null &&
                allocatedEntry !== undefined
            ) {
                if ( allocatedEntry.allocation === undefined ) {
                    this.splitEntryOnTimeLeft(allocatedEntry, allocation);
                } else {
                    //change from one allocation to another
                    allocatedEntry.allocation = allocation;
                }
            }

            this.calculateRatios();

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

    splitEntryOnTimeLeft(entry, allocation) {

        if (
            this.timesheet.maxhours === undefined ||
            this.timesheet.maxhours === null ||
            this.timesheet.maxhours === ''
        ) {
            entry.allocation = allocation;
            return true;
        }
        
        let totalHours = this.getTotalAllocatedHours();
        let hoursLeft = new Decimal(this.timesheet.maxhours).sub(totalHours);

        if (hoursLeft.isNegative() || hoursLeft.isZero()) {
            throw 'There should be hours to allocate';
        }

        let duration = new Decimal(entry.duration);
        if (duration.lessThanOrEqualTo(hoursLeft)) {
            entry.allocation = allocation;
            return;
        }

        //if the duration of the entry is greater than the time left to allocate
        //split it in 2
        let hoursToUnAllocate = duration.sub(hoursLeft);
        let ratio = hoursLeft.div(duration);
        let reverseRatio = new Decimal(1).sub(ratio);

        //create new entry
        let newEntry = Object.assign({}, entry);
        newEntry.id = newEntry.purpose + ':' + Date.now();
        this.applyDurationsRatio(newEntry, reverseRatio);
        newEntry.allocation = undefined;
        newEntry.ratio = undefined;

        let allocatedEntry = entry;
        entry.allocation = allocation;
        this.applyDurationsRatio(entry, ratio);
        entry.ratio = new Decimal(entry.ratio).mul(ratio); 

        this.timesheet.entries = [
            newEntry,
            ...this.timesheet.entries                    
        ]

    }

    /**
     * Apply ratio to entry durations
     */
    applyDurationsRatio(entry, ratio) {
        entry.duration = new Decimal(entry.duration).mul(ratio).toJSON();
        let hoursMinutes = this.getHoursMinutes(new Decimal(entry.duration));
        entry.hours = hoursMinutes.hours.toJSON();
        entry.minutes = hoursMinutes.minutes.toJSON();

        entry.interpret_duration = new Decimal(entry.interpret_duration).mul(ratio).toJSON(); 
        let interpretHoursMinutes = this.getHoursMinutes(new Decimal(entry.interpret_duration));
        entry.hours = interpretHoursMinutes.hours.toJSON();
        entry.minutes = interpretHoursMinutes.minutes.toJSON();        
    }

    /**
     * Takes a duration in hours and splits in hours and minutes
     */
    getHoursMinutes(duration) {
        return {
            hours: duration.floor(), 
            minutes: duration
                .sub(
                    new Decimal(duration)
                    .floor()
                )
                .mul(new Decimal(60))                
        };
    }

    openEntry(id, user) {
        this.router.navigateToRoute(
            'timesheets/' + this.timesheet._id + '/' + id + 
            '?r=admin/' + this.timesheet._id +
            '&u=' + this.userName
        );
    }
}