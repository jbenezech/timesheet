export class TruncateValueConverter {
    toView(value, length) {
        
        if (value === null || value === undefined || value.length <= length) {
            return value;
        }
        
        return value.substring(0, length) + '...';
    }
}