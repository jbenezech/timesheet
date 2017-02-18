import { bindable, inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { DialogService } from "aurelia-dialog";

import { Confirmation } from "./confirmation";

@inject(DialogService, I18N)
export class DeleteButton {

    @bindable action=()=>{};

    @bindable message;

    constructor(dialogService, i18n) {
        this.dialogService = dialogService;
        this.i18n = i18n;
    }

    do($event) {
        $event.stopPropagation();
        this.dialogService.open({
            viewModel: Confirmation,
            model: this.i18n.tr(this.message)
        }).then(result => {
            if (result.wasCancelled) return;
            this.action();
        });
    }

}