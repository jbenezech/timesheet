import { inject, bindable, TaskQueue } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { AdminRouter } from './admin-router';
import { Session } from '../../services/session';
import { DBService } from '../../services/db-service';
import settings from '../../config/app-settings';
import moment from 'moment';
import { I18N } from 'aurelia-i18n';
import Decimal from 'decimal';

@inject(Session, DBService, I18N, EventAggregator, TaskQueue, AdminRouter)
export class AdminReports {

    @bindable month;
    users = new Map();
    allocations = new Map();
    allocationUserReports = new Map();
    allocationReports = [];    
    showMonthAggregate = false;

    constructor(session,db, i18n, ea, taskQueue, router) {
        this.session = session;
        this.db = db;
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
                    if (entries) {
                        let allocationUserReports = [];
                        entries.forEach( (entry) => {
                            let allocation = entry.key.split(':')[1];
                            allocationUserReports.push({
                                allocation: allocation,
                                allocationName: me.allocations.get(allocation),
                                ratio: new Decimal(parseFloat(entry.value[0])).mul(100),
                                duration: new Decimal(entry.value[1]),
                                salary: new Decimal(entry.value[2]).mul(parseFloat(entry.value[0]))
                            });
                        });
                        me.allocationUserReports.set(
                            user.doc.name,
                            me.groupReportsByAllocation(allocationUserReports)
                        );                        
                    }
                }) 
            );
        }); 

        return Promise.all(promises);
    }

    groupReportsByAllocation(reports) {

        let totals = {
            ratio: new Decimal(0),
            duration: new Decimal(0),
            salary: new Decimal(0)
        }

        let grouped = new Map();
        for (let reportIdx in reports) {

            let report = reports[reportIdx];
            
            if (!grouped.has(report.allocation)) {
                grouped.set(report.allocation, report);
                totals.ratio = totals.ratio.add(report.ratio);
                totals.duration = totals.duration.add(report.duration);
                totals.salary = totals.salary.add(report.salary);
                continue;
            }

            let current = grouped.get(report.allocation);

            current.ratio = current.ratio.add(report.ratio);
            current.duration = current.duration.add(report.duration);
            current.salary = current.salary.add(report.salary);

            totals.ratio = totals.ratio.add(report.ratio);
            totals.duration = totals.duration.add(report.duration);
            totals.salary = totals.salary.add(report.salary);

        }

        return {
            entries: Array.from(grouped.values()),
            totals: totals
        };
    }

    aggregateReports() {

        let allReports = [];
        
        for ( let allocationUserReportObjects of this.allocationUserReports.values() ) {
            allReports = [
                ...allReports,
                ...allocationUserReportObjects.entries
            ];
        }

        this.allocationReports = this.groupReportsByAllocation(allReports);

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
            this.i18n.tr('salary') + 
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

        for (let reportIdx in reports.entries) {
            let report = reports.entries[reportIdx];
            csvContent += 
                report.allocationName + ';' + 
                report.ratio + ';' + 
                report.duration + ';' + 
                report.salary + 
                '\n'
            ;
        };

        csvContent += 
            ';' + 
            reports.totals.ratio + ';' + 
            reports.totals.duration + ';' + 
            reports.totals.salary +
            '\n'
        ;
        
        lnk.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csvContent));
        lnk.setAttribute('download', fileName);
    }
}