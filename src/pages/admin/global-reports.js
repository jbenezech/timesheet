import { inject, bindable, TaskQueue } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { AccountingService } from '../../services/accounting-service';
import moment from 'moment';
import { I18N } from 'aurelia-i18n';
import Decimal from 'decimal';

import { AdminRouter } from './admin-router';
import { DBService } from '../../services/db-service';
import settings from '../../config/app-settings';
import { log } from '../../services/log';

@inject(Element, DBService, I18N, EventAggregator, TaskQueue)

/**
 * VM for Timesheets reports
 */
export class GlobalReports {

    //map of all user names => user docs
    users = new Map();

    //maps purposes ids => names
    purposes = new Map();

    //reports for each user mapping username => timesheet report
    timesheetUserReports = new Map();

    fromDate = new Date();
    toDate = new Date();

    constructor(element, db, i18n, ea, taskQueue) {
        this.element = element;
        this.db = db;
        this.i18n = i18n;
        this.ea = ea;
        this.taskQueue = taskQueue;
    }

    attached() {

        let me = this;
        
        $(this.element).find('.users.report.selection .date.ui.calendar').each(function() {
            $(this).calendar({
                type: 'month',
                formatInput: false,
                text: settings.calendar_text
            });
        });

        $(this.element).find('.users.report.selection .from.date.ui.calendar').each(function() {
            $(this).calendar(
                'set date',
                new Date(me.getBeginYear())
            );
        });

        $(this.element).find('.users.report.selection .to.date.ui.calendar').each(function() {
            $(this).calendar(
                'set date',
                new Date(me.getEndYear())
            );
        });

        this.loadReports();

        //reload data if timesheet is synced from remote with new data
        this.subscriber = this.ea.subscribe('dbsync', response => {
            if (response.dbName.match(/^timesheet\-/)) {
                me.retrieveTimesheetReports().then( () => {
                    me.taskQueue.queueMicroTask(() => {
                        me.generateUsersExportLinks();                                        
                    });
                })
            }
        });

    }

    detached() {
        this.subscriber.dispose();
    }

    submit() {
        this.loadReports();
    }

    //retrieves the representation the first month of the year
    getBeginYear() {
        return (new Date()).getFullYear() + '-01-01';
    }

    //retrieves the representation the last month of the year
    getEndYear() {
        return (new Date()).getFullYear() + '-12-31';
    }

    getCalendarDate(calendar) {
        let date = calendar.calendar('get date');
        return moment(date).format('YYYY-MM');
    }

    getFromDate() {
        return this.getCalendarDate($(this.element).find('.users.report.selection .from.date.ui.calendar'));
    }

    getToDate() {
        return this.getCalendarDate($(this.element).find('.users.report.selection .to.date.ui.calendar'));
    }

    loadReports() {
        this.retrieveUsers()
        .then( () => this.retrievePurposes() )
        .then( () => this.retrieveTimesheetReports() )
        .then( () => {
            this.taskQueue.queueMicroTask(() => {
                this.generateUsersExportLinks();                                        
            });
        });
    }

    retrieveUsers() {
        let me = this;

        return this.db.listUsers().then( response => {
            response.forEach( (user) => {
                me.users.set(user.doc.name, user);
            });
            return new Promise((resolve) => { resolve(); });
        }); 

    }

    retrievePurposes() {
        let me = this;
        return this.db.list('purpose').then( response => {

            if (response) {

                response.forEach(function (purpose) {
                    me.purposes.set(purpose.id, purpose.doc.name);
                })               
            
            }

            return new Promise((resolve) => { resolve(); });
        });
    }

    /**
     * Retrieve and calculate reports for each users
     * Calculation is currently done in memory because only javascript views
     * can be used on cloudant and they cannot be used to do floating point arithemtics.
     * Ideally, an Erlang view can probably be used to do that
     */
    retrieveTimesheetReports() {

        let me = this;

        let fromDate = this.getFromDate();
        let toDate = this.getToDate();

        this.timesheetUserReports = new Map();

        let promises = [];
        this.users.forEach(function (user) {            

            promises.push(
                me.db.view(
                    'timesheet-' + user.doc.name, 
                    'sheet-report/purpose-report',
                    fromDate,
                    toDate,
                    false
                ).then( entries => {

                    if (entries === undefined) {
                        return new Promise( (resolve) => resolve([]) );
                    }

                    let purposeReport = new Map();

                    for (let entryIdx in entries) {
                        let entry = entries[entryIdx];

                        let purpose = entry.value[0];

                        let sheetCount = 0;
                        let totalDuration = 0;

                        if (purposeReport.has(purpose)) {
                            sheetCount = purposeReport.get(purpose).nbrSheets;
                            totalDuration = purposeReport.get(purpose).totalDuration;
                        }

                        purposeReport.set(purpose, {
                            purpose: purpose,
                            purposeName: me.purposes.get(purpose),
                            nbrSheets: sheetCount + 1,
                            totalDuration: new Decimal(entry.value[1]).add(totalDuration)
                        })

                    };

                    return Array.from(purposeReport.values());

                })
                .then( purposeReports => {

                    let totalSheets = 0;
                    let totalDuration = new Decimal(0);

                    for (let reportIdx in purposeReports) {
                        let report = purposeReports[reportIdx];
                        totalSheets += report.nbrSheets;
                        totalDuration = totalDuration.add(report.totalDuration);
                    };

                    me.timesheetUserReports.set(
                        user.doc.name,
                        {
                            purposes: purposeReports,
                            totals: {
                                totalSheets: totalSheets,
                                totalDuration: totalDuration
                            }
                        }
                        
                    );
                })
            );
        }); 

        return Promise.all(promises);
    }

    //attach links to download reports as csv
    generateUsersExportLinks() {

        this.generateExportLink();

        let me = this;
        this.users.forEach( (user) => {
            if (me.timesheetUserReports.has(user.doc.name)) {
                me.generateExportLink(user.doc.name);
            }
        });
    }

    generateExportLink(user = null) {

        let me = this;
        let csvContent = this.getFromDate() + ' / ' + this.getToDate() + '\n' +
            this.i18n.tr('purpose') + ';' +
            this.i18n.tr('nbrsheets') + ';' +
            this.i18n.tr('duration')
            '\n'
        ;

        let reports =  Array.from(this.timesheetUserReports);
        let fileName = this.getFromDate() + '-' + this.getToDate() + '.csv';
        let lnk = document.getElementById('csv-export-link');
        if (user !== null) {
            fileName = user + "-" + this.getFromDate() + '-' + this.getToDate() + '.csv';
            lnk = document.getElementById(user + '-csv-export-link');
        }

        if (lnk === null) {
            return;
        }

        for (let idx in reports) {
            let report = reports[idx][1];
            let userName = reports[idx][0];
            if (user !== null && user !== userName) {
                continue;
            } else {
                csvContent += '\n' + userName + '\n';
            }
            for (let purposeIdx in report.purposes) {

                let purpose = report.purposes[purposeIdx];

                csvContent += 
                    purpose.purposeName + ';' + 
                    purpose.nbrSheets + ';' + 
                    purpose.totalDuration +
                    '\n'
                ;

            }
        };

        lnk.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csvContent));
        lnk.setAttribute('download', fileName);
    }
}