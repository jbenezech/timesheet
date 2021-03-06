import { bindable, customElement, inject, TaskQueue } from 'aurelia-framework';
import { DBService } from '../../services/db-service';
import { EventAggregator } from 'aurelia-event-aggregator';
import { DialogService } from "aurelia-dialog";
import { I18N } from 'aurelia-i18n';

import { Confirmation } from "../confirmation/confirmation";

@customElement('dropdown')
@inject(Element, DBService, EventAggregator, I18N, DialogService)

/**
 * Dropdown custom element for SemanticUI
 * Loads data from backend. Bindings:
 * - selectedEntry : bind the selected key with parent element's attribute
 * - route: name of the database to load documents from
 * - name: name of the select element
 * - required: boolean
 * - multiple: boolean for multiple selects
 * - selectAction: action to call on parent element when an entry is selected
 * - addAction: action to call when a new entry is added
 */
export class DropDownCustomElement {

    @bindable entries;
    @bindable selectedEntry;
    @bindable route;
    @bindable name;
    @bindable required = false;
    @bindable multiple = false;
    @bindable allowAdd = false;
    @bindable selectAction = () => {};
    @bindable addAction = () => {};
    
    selectedEntryName;

    constructor(element, db, ea, i18n, dialogService) {
        this.element = element;
        this.db = db;
        this.ea = ea;
        this.i18n = i18n;
        this.dialogService = dialogService;
    }

    attached() {
        let dropdown = this;
        $(this.element).find('.ui.dropdown').dropdown({
            'forceSelection': true,
            'allowAdditions': dropdown.allowAdd,
            'hideAdditions': !dropdown.allowAdd,
            'onChange': function(value, text, $choice) {
                if (
                    typeof $choice !== 'undefined' &&
                    $($choice[0]).hasClass('addition')
                ) {
                    dropdown.dialogService.open({
                        viewModel: Confirmation,
                        model: dropdown.i18n.tr('dropdown.add_confirm', {entry: text})
                    }).then(result => {
                        if (result.wasCancelled) {
                            dropdown.selectedEntry = undefined;
                            return;
                        }
                        dropdown.save(text);
                    });
                } else {
                    dropdown.selectedEntry = value;
                }
            }
        });
        this.load();

        this.subscriber = this.ea.subscribe('dbsync', response => {
            if (response.dbName === dropdown.route) {
                dropdown.load();
            }
        });
    }

    detached() {
        this.subscriber.dispose();
    }

    selectedEntryChanged() {

        if (
            this.selectedEntry === undefined || 
            this.selectedEntry === '' ||
            this.selectedEntry === []
        ) {
            this.selectedEntry = undefined;
        }

        //leave if the entry is new as this will be re-triggered after the save operation
        if (this.isSelectedEntryNew()) {
            return;
        }

        let selected = $(this.element).find('.dropdown').dropdown('get value');

        if (
            selected[0] !== null && 
            this.selectedEntry === undefined
        ) {
            $(this.element).find('.dropdown').dropdown('clear');
        }
        this.setEntryName();

        if (this.selectAction !== null) {
            this.selectAction({ dropdown: this});
        }
    }

    isSelectedEntryNew() {

        if (this.selectedEntry === undefined) {
            return false;
        }
        
        if (this.entries === null) {
            return true;
        }

        let me = this;
        let isNew = true;
        this.entries.forEach( (entry) => {
            if (entry.id === me.selectedEntry) {
                isNew = false;
            }
        });

        return isNew;
    }

    restoreDefaults() {
        $(this.element).find('.text')
            .addClass('default');
        this.selectedEntryName = this.getPlaceHolder();
    }

    getPlaceHolder() {
        return $(this.element).find('.text').data('default');
    }

    setEntryName() {
        if (this.multiple) {
            return;
        }

        if (! this.entries) {
            return;
        }

        for (let entry of this.entries) {
            if (entry.id == this.selectedEntry) {
                this.selectedEntryName = entry.doc.name;
            }            
        }

        if (
            this.selectedEntryName &&
            this.selectedEntryName != this.getPlaceHolder()
        ) {
            $(this.element).find('.text')
            .removeClass('default');
        } else {
            this.restoreDefaults();
        }
    }

    load() {

        this.db.list(this.route).then(
            entries => {

            this.entries = entries;

            if (
                this.entries &&
                this.required &&
                (this.selectedEntry === undefined || this.selectedEntry === '') &&
                this.entries.length > 0
            ) {
                this.selectedEntry = this.entries[0].id;
            }

            this.setEntryName();
        });
                   
    }

    save(newEntry) {
        let doc = {
            name: newEntry
        };
        let me = this;

        this.db.create(this.route, doc).then(
            response => {
                doc._id = response.id;
                me.entries = [
                    {id: response.id, doc : doc},
                    ...me.entries
                ];
                me.selectedEntry = doc._id;
                $(me.element).find('.dropdown').dropdown('set value', doc._id);
                me.addAction({ dropdown: me });
            }
        )
    }
}