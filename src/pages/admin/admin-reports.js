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

@inject(DBService, AccountingService, I18N, EventAggregator, TaskQueue)

/**
 * VM for accounting reports
 */
export class AdminReports {

    //month for which the report is shown
    @bindable month;

    //map of all user names => user docs
    users = new Map();

    //maps allocation ids => names
    allocations = new Map();

    //reports for each user mapping username => accounting report
    allocationUserReports = new Map();

    //aggregate reports for each allocation
    allocationReports = [];

    //switch to see total monthly report or per user report
    showMonthAggregate = false;

    constructor(db, accounting, i18n, ea, taskQueue) {
        this.db = db;
        this.accounting = accounting;
        this.i18n = i18n;
        this.ea = ea;
        this.taskQueue = taskQueue;
    }

    attached() {

        let me = this;
        $('#showMonthAggregate').checkbox({
            onChange: function() {
                me.showMonthAggregate = $('#showMonthAggregate').hasClass('checked');
            }
        });

        this.loadReports();

        //reload data if timesheet is synced from remote with new data
        this.subscriber = this.ea.subscribe('dbsync', response => {
            if (response.dbName.match(/^timesheet\-/)) {
                me.retrieveAllocationReports().then( () => {
                    me.taskQueue.queueMicroTask(() => {
                        me.generateUsersExportLinks();                                        
                        me.aggregateReports();
                    });
                })
            }
        });

    }

    detached() {
        this.subscriber.dispose();
    }

    refresh() {
        this.loadReports();
    }

    //retrieves the representation the month after current one
    getNextMonth() {

        let monthArr = this.month.split('-');
        if (parseInt(monthArr[1]) === 12) {
            return (parseInt(monthArr[0]) + 1 ) + '-01';
        }

        let next = parseInt(monthArr[1]) + 1;

        return monthArr[0] + '-' + (next<10?'0':'') + next;

    }

    loadReports() {
        this.retrieveUsers()
        .then( () => this.retrieveAllocations() )
        .then( () => this.retrieveAllocationReports() )
        .then( () => {
            this.taskQueue.queueMicroTask(() => {
                this.generateUsersExportLinks();                                        
                this.aggregateReports();
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

    retrieveAllocations() {
        let me = this;
        return this.db.list('allocation').then( response => {

            if (response) {

                response.forEach(function (allocation) {
                    me.allocations.set(allocation.id, allocation.doc.name);
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
    retrieveAllocationReports() {

        let me = this;

        let promises = [];
        this.users.forEach(function (user) {

            promises.push(
                me.db.view(
                    'timesheet-' + user.doc.name, 
                    'allocations/stats',
                    me.month,
                    me.getNextMonth(),
                    false
                ).then( entries => {

                    if (entries === undefined) {
                        return new Promise( (resolve) => resolve([]) );
                    }

                    let allocationUserReports = [];
                    let reportsPromises = [];
                
                    return Promise.all(entries.map( (entry) => {

                        let allocation = entry.key.split(':')[1];

                        let report = {
                            allocation: allocation,
                            allocationName: me.allocations.get(allocation),
                            ratio: new Decimal(parseFloat(entry.value[0])).mul(100),
                            duration: new Decimal(entry.value[1]),
                            salary: new Decimal(entry.value[2]).mul(parseFloat(entry.value[0])),
                            precarite: entry.value[3]
                        };

                         return me.accounting.provisionAccounts(
                            me.month,
                            report
                        );

                    }));

                })
                .then( allocationUserReports => {

                    me.allocationUserReports.set(
                        user.doc.name,
                        me.groupReportsByAllocation(allocationUserReports)
                    );
                })
                .then ( () => {
                    return me.db.view(
                        'timesheet-' + user.doc.name, 
                        'allocations/unallocated',
                        me.month,
                        me.month,
                        false
                    );
                })
                .then( entries => {
                    if (entries === undefined || entries.length === 0) {
                        return;
                    }                    
                    let report = me.allocationUserReports.get(user.doc.name);
                    report.totals.unallocated = {
                        duration: new Decimal(0)
                    };
                    entries.map( (entry) => {
                        report.totals.unallocated.duration = report.totals.unallocated.duration.add(new Decimal(entry.value));
                    });
                    console.log(report.totals);
                })
            );
        }); 

        return Promise.all(promises);
    }

    groupReportsByAllocation(reports) {

        let totals = {};

        let nbrReports = 0;

        let grouped = new Map();
        for (let reportIdx in reports) {

            let report = Object.assign({}, reports[reportIdx]);
            if (!grouped.has(report.allocation)) {
                grouped.set(report.allocation, Object.assign({}, report));
                totals = this.addReportsData(totals, report);
                continue;
            }

            let current = grouped.get(report.allocation);

            grouped.set(report.allocation, this.addReportsData(current, report));
            totals = this.addReportsData(totals, report);

        }

        return {
            entries: Array.from(grouped.values()),
            totals: totals
        };
    }

    //Adds Decimal properties from source to target and return the result
    addReportsData(target, source) {

        let result = {};

        for (let prop of Object.getOwnPropertyNames(source)) {
                        
            if (
                typeof (source[prop]) === 'object' &&
                source[prop] instanceof Decimal
            ) {
                result[prop] = new Decimal(0);
                if (target[prop] === undefined) {
                    target[prop] = new Decimal(0);
                }
                result[prop] = target[prop].add(source[prop]);
            } else {
                result[prop] = source[prop];
            }
            
        }

        if (source.accounts !== undefined) {
            result.accounts = {};
            if (target.accounts === undefined) {
                target.accounts = {};
            }                    
            result.accounts = this.addReportsData(target.accounts, source.accounts);
        }

        return result;
    }

    //aggregates all reports on allocation, regardless of user
    aggregateReports() {

        let allReports = [];
        let nbrReports = 0;

        for ( let allocationUserReportObjects of this.allocationUserReports.values() ) {            
            allReports = [
                ...allReports,
                ...allocationUserReportObjects.entries
            ];
            nbrReports++;
        }
        this.allocationReports = this.groupReportsByAllocation(allReports);

        //recalculate ratio based on number of reports
        for (let entry of this.allocationReports.entries) {            
            entry.ratio = entry.ratio.div(nbrReports);
        }
        if (this.allocationReports.totals.ratio !== undefined) {
            this.allocationReports.totals.ratio = this.allocationReports.totals.ratio.div(nbrReports);
        }
        
        this.generateExportLink();

    }

    //attach links to download reports as csv
    generateUsersExportLinks() {

        let me = this;
        this.users.forEach( (user) => {
            if (me.allocationUserReports.has(user.doc.name)) {
                me.generateExportLink(user.doc.name);
            }
        });
    }

    generateExportLink(user = null) {

        let me = this;
        let csvContent = this.month + '\n' +
            this.i18n.tr('allocation') + ';' +
            this.i18n.tr('ratio') + ';' +
            this.i18n.tr('duration') + ';' +
            this.i18n.tr('salary') + ';' +
            this.i18n.tr('charges') + ';' +
            this.i18n.tr('provisionCPbrut') + ';' +
            this.i18n.tr('provisionCPcharges') + ';' +
            this.i18n.tr('precaritebrut') + ';' +
            this.i18n.tr('precaritecharges') +
            '\n'
        ;

        let reports = this.allocationReports;
        let fileName = me.month + '.csv';
        let lnk = document.getElementById('csv-export-link');
        if (user !== null) {
            reports = this.allocationUserReports.get(user);
            fileName = user + "-" + me.month + '.csv';
            lnk = document.getElementById(user + '-csv-export-link');
        }

        if (lnk === null || reports.entries.length === 0) {
            return;
        }

        for (let reportIdx in reports.entries) {
            let report = reports.entries[reportIdx];
            csvContent += 
                report.allocationName + ';' + 
                report.ratio + ';' + 
                report.duration + ';' + 
                report.salary + ';' +
                report.accounts.charges + ';' +
                report.accounts.provisionCPBrut + ';' +
                report.accounts.provisionCPCharges + ';' +
                report.accounts.primePrecariteBrut + ';' +
                report.accounts.primePrecariteCharges +
                '\n'
            ;
        };

        csvContent += 
            ';' + 
            reports.totals.ratio + ';' + 
            reports.totals.duration + ';' + 
            reports.totals.salary + ';' +
            reports.totals.accounts.charges + ';' +
            reports.totals.accounts.provisionCPBrut + ';' +
            reports.totals.accounts.provisionCPCharges + ';' +
            reports.totals.accounts.primePrecariteBrut + ';' +
            reports.totals.accounts.primePrecariteCharges +
            '\n'
        ;
        
        if (reports.totals.unallocated !== undefined) {
            csvContent += this.i18n.tr('totalnoallocated') + ';' + reports.totals.unallocated.duration + '\n';
        }
        
        csvContent +=
            this.i18n.tr('netpayable') + ';' + reports.totals.accounts.netPayable + '\n' +
            this.i18n.tr('urssaf') + ';' + reports.totals.accounts.urssaf + '\n' +
            this.i18n.tr('provisionCPbrut') + ';' + reports.totals.accounts.provisionCP + '\n' +
            this.i18n.tr('provisionprecarite') + ';' + reports.totals.accounts.provisionPrecarite + '\n'            
        ;
        
        lnk.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csvContent));
        lnk.setAttribute('download', fileName);
    }
}