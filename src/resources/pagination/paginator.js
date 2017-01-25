import {bindable, inject} from 'aurelia-framework';
import {DialogService} from "aurelia-dialog";

export class Paginator {

    @bindable pagination;
    @bindable action=()=>{};
    @bindable hasLoadMore;

    paginate(page) {
        this.action({ params: {
            "page": (page === undefined) ? this.pagination.currentPage : page, 
            "limit": this.pagination.itemsPerPage
        }});
    }

    loadMore() {
        this.action({ params: {
            "page": (parseInt(this.pagination.currentPage) + 1), 
            "limit": this.pagination.itemsPerPage
        }});        
    }
}