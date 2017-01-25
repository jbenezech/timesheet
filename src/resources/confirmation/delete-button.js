import {bindable, inject} from 'aurelia-framework';
import {DialogService} from "aurelia-dialog";
import {Confirmation} from "./confirmation";

@inject(DialogService)
export class DeleteButton extends BaseViewModel {

    @bindable action=()=>{};

    @bindable message = "Are you sure ?";

    constructor(dialogService, ...rest) {
        super(...rest);
        this.dialogService = dialogService;
        this.message = this.i18n.tr('delete_sure');
    }

    do($event) {
        $event.stopPropagation();
        this.dialogService.open({
            viewModel: Confirmation,
            model: this.message
        }).then(result => {
            if (result.wasCancelled) return;
            this.action();
        });
    }

}