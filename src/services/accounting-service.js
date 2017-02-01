import { inject, singleton } from 'aurelia-framework';
import { Session} from './session';
import PouchDB from 'pouchdb';
import moment from 'moment';
import { EventAggregator } from 'aurelia-event-aggregator';
import { HttpClient } from 'aurelia-fetch-client';
import { log } from './log';
import { DBService } from './db-service';
import Decimal from 'decimal';

@inject(Session, DBService, HttpClient, EventAggregator)
@singleton()
export class AccountingService {

    rules = new Map();

    constructor(session, db, http, ea) {
        this.session = session;
        this.db = db;
        this.http = http;
        this.ea = ea;
    }

    retrieveRules(accountingRuleEndKey) {

        if (accountingRuleEndKey === undefined) {
            return;
        }

        return this.db.view('accounting', 'accounting/rules', accountingRuleEndKey, '', false, true, 1)
        .then( rows => {

            let row = rows[0];
            this.rules.set(
                row.key,
                {
                    charges: new Decimal(row.value[0]),
                    provision_cp_brut: new Decimal(row.value[1]),
                    provision_cp_charges: new Decimal(row.value[2]),
                    prime_precarite_brut: new Decimal(row.value[3]),
                    net_payable: new Decimal(row.value[4]),
                    ursaff: new Decimal(row.value[5])
                }
            );

        });

    }

    provisionAccounts(accountingRuleEndKey, salarySlip) {

        let me = this;
        if (!this.rules.has(accountingRuleEndKey)) {
            return this.retrieveRules(accountingRuleEndKey).then( () => {
                return me.doProvision(me.rules.get(accountingRuleEndKey), salarySlip);
            });
        }

        return new Promise( (resolve) => resolve(me.doProvision(me.rules.get(accountingRuleEndKey), salarySlip)) );
    }

    doProvision(rules, salarySlip) {    
        
        let accounts = {
            salary: salarySlip.salary,
            charges: salarySlip.salary.mul(rules.charges),
            provisionCPBrut: salarySlip.salary.mul(rules.provision_cp_brut),
            netPayable: salarySlip.salary.mul(rules.net_payable),
            ursaff: salarySlip.salary.mul(rules.ursaff)
        };

        accounts.provisionCPCharges = accounts.charges.mul(rules.provision_cp_charges);
        accounts.provisionCP = accounts.provisionCPBrut.add(accounts.provisionCPCharges);

        if (salarySlip.precarite) {
            accounts.primePrecariteBrut = salarySlip.salary.mul(rules.prime_precarite_brut);
            accounts.primePrecariteCharges = accounts.primePrecariteBrut.mul(rules.provision_cp_charges);
            accounts.provisionPrecarite = accounts.primePrecariteBrut.add(accounts.primePrecariteCharges);
        } else {
            accounts.primePrecariteBrut = new Decimal(0);
            accounts.primePrecariteCharges = new Decimal(0);
            accounts.provisionPrecarite = new Decimal(0);        
        }

        salarySlip.accounts = accounts;

        return salarySlip;
    }

}