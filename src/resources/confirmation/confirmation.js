import { inject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';

@inject(DialogController)
export class Confirmation {

    constructor(dialogController) {
        this.dialogController = dialogController;
    }

    activate(data) {
        this.message = data;
    }
}