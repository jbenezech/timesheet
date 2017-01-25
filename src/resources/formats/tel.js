export class TelValueConverter {
    toView(value) {
        let html = '';
        if (
            value === undefined ||
            !Array.isArray(value)
        ) {
            return html;
        }
        value.forEach(function(tel) {
            html += '<a href="tel: ' + tel + '">' + tel + '</a> '; 
        });
    
        return html;
    }
}