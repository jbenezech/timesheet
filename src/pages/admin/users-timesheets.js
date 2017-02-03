
import { BindingEngine, inject, NewInstance, bindable, observable } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { AdminRouter } from './admin-router';
import { Session } from '../../services/session';
import { DBService } from '../../services/db-service';
import settings from '../../config/app-settings';
import moment from 'moment';
import { I18N } from 'aurelia-i18n';
import { log } from '../../services/log';

@inject(Element, Session, DBService, I18N, EventAggregator, BindingEngine, AdminRouter)
export class UsersTimesheets {

    @bindable month;

    timesheets = new Map();
    users = new Map();
    purposes = new Map();
    unallocatedOnly = true;
    
    constructor(element, session,db, i18n, ea, bindingEngine, router) {
        this.element = element;
        this.session = session;
        this.db = db;
        this.i18n = i18n;
        this.ea = ea;
        this.bindingEngine = bindingEngine;
        this.router = router;
    }

    attached() {

        let me = this;
        $('#showAll').checkbox({
            onChange: function() {
                me.unallocatedOnly = !$('#showAll').hasClass('checked');
            }
        });

        this.retrieveData();

        this.ea.subscribe('dbsync', response => {
            if (response.dbName.match(/^timesheet\-/)) {
                me.retrieveTimesheets();
            }
        });
    }

    retrieveData() {
        this.retrieveUsers().then( () => {
            this.retrievePurposes().then( () => {
                this.retrieveTimesheets();            
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

    retrieveTimesheets() {
        let me = this;

        this.users.forEach(function (user) {

            me.db.get('timesheet-' + user.doc.name,  me.month).then( timesheet => {
                if (timesheet) {
                    me.timesheets.set(user.doc.name, timesheet);                                        
                }
            }); 

        }); 
    }
}