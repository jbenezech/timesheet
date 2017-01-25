import moment from 'moment';

export class MonthFormatValueConverter {
    toView(value) {    
        return moment(value).format('MMMM YYYY');
    }
}