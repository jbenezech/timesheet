export class Pagination {

    constructor(currentPage, itemsPerPage, totalCount, items) {
        this.currentPage = currentPage;
        this.itemsPerPage = itemsPerPage;
        this.totalCount = totalCount;        
        this.items = items;
        
        this.setNumberPages();
        this.setVisiblePages();
    }

    setNumberPages() {
        this.numberPages = Math.ceil(this.totalCount/this.itemsPerPage);
    }

    setVisiblePages() {
        const NBR_START = 2;
        const NBR_END = 2;
        const NBR_PAGES = 10;
        const NBR_DISABLED = 2;
        const NBR_VISIBLE = 7;

        if (this.numberPages <= NBR_PAGES) {
            this.visiblePages = this.numberPages;
            return;
        }

        //always show first and last pages
        this.startPages = NBR_START;
        this.endPages = Array
            .apply(null, Array(NBR_END))
            .map((v,i)=>this.numberPages - i - 1)
            .reverse();

        //show some pages before and some pages after the current
        let visibleRangeStart = Math.max(
            NBR_START,
            this.currentPage - (NBR_VISIBLE - 1)/2
        );
        let visibleRangeEnd = Math.max(
            NBR_VISIBLE,
            this.currentPage + 1 + (NBR_VISIBLE - 1)/2
        );

        let nbrVisiblePages = NBR_VISIBLE - NBR_START;

        //if we start after the first pages, add some disabled marker
        if (
            visibleRangeStart > NBR_START
        ) {
            this.firstDisabledPages = NBR_DISABLED;
        }

        if (visibleRangeEnd > this.numberPages) {
            //if we reached the end, show more previous pages
            visibleRangeStart = this.numberPages - NBR_VISIBLE;
        } else {
            //if we stop before the last pages, add more disabled marker
            this.lastDisabledPages = NBR_DISABLED;
        }

        this.visiblePages = 
            Array
            .apply(null, Array(nbrVisiblePages))
            .map((v,i)=>i+visibleRangeStart);

    }
}