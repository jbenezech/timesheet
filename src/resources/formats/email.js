export class EmailValueConverter {
    toView(value) {
        let html = '';
        if (
            value === undefined ||
            !Array.isArray(value)
        ) {
            return html;
        }
        value.forEach(function(mail) {
            html += '<a href="mailto: ' + mail + '">' + mail + '</a> '; 
        });
    
        return html;
    }
}