import { inject, bindable, TaskQueue } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { AdminRouter } from './admin-router';
import { Session } from '../../services/session';
import { DBService } from '../../services/db-service';
import { AccountingService } from '../../services/accounting-service';
import settings from '../../config/app-settings';
import moment from 'moment';
import { I18N } from 'aurelia-i18n';
import Decimal from 'decimal';
import { log } from '../../services/log';

@inject(Session, DBService, AccountingService, I18N, EventAggregator, TaskQueue, AdminRouter)
export class AdminReports {

    @bindable month;
    users = new Map();
    allocations = new Map();
    allocationUserReports = new Map();
    allocationReports = [];    
    showMonthAggregate = false;

    constructor(session, db, accounting, i18n, ea, taskQueue, router) {
        this.session = session;
        this.db = db;
        this.accounting = accounting;
        this.i18n = i18n;
        this.ea = ea;
        this.router = router;
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

        this.ea.subscribe('dbsync', response => {
            if (response.dbName.match(/^timesheet\-/)) {
                me.loadReports();
            }
        });

    }

    refresh() {
        this.loadReports();
    }

    getNextMonth() {

        let monthArr = this.month.split('-');
        if (parseInt(monthArr[1]) === 12) {
            return (parseInt(monthArr[0]) + 1 ) + '-01';
        }

        let next = parseInt(monthArr[1]) + 1;

        return monthArr[0] + '-' + (next<10?'0':'') + next;

    }

    loadReports() {
        this.retrieveUsers().then( () => {
            this.retrieveAllocations().then( () => {
                this.retrieveAllocationReports().then( () => {
                    this.taskQueue.queueMicroTask(() => {
                        this.generateUsersExportLinks();                                        
                        this.aggregateReports();
                    });
                })
            })
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
                            me.accountingRuleEndKey,
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
                        
            if (typeof (source[prop]) === 'object') {
                if (source[prop] instanceof Decimal) {
                    result[prop] = new Decimal(0);
                    if (target[prop] === undefined) {
                        target[prop] = new Decimal(0);
                    }
                    result[prop] = target[prop].add(source[prop]);
                }
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
            this.i18n.tr('provisionCP-brut') + ';' +
            this.i18n.tr('provisionCP-charges') + ';' +
            this.i18n.tr('primeprecarite-brut') + ';' +
            this.i18n.tr('primeprecarite-charges') +
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
            '\n' +
            this.i18n.tr('netpayable') + ';' + reports.totals.accounts.netPayable + '\n' +
            this.i18n.tr('ursaaf') + ';' + reports.totals.accounts.ursaff + '\n' +
            this.i18n.tr('provisionCP') + ';' + reports.totals.accounts.provisionCP + '\n' +
            this.i18n.tr('provisionprecarite') + ';' + reports.totals.accounts.provisionPrecarite + '\n'            
        ;
        
        lnk.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csvContent));
        lnk.setAttribute('download', fileName);
    }
}