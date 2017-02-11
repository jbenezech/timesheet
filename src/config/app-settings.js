import environment from '../environment'

var settings = {
    remoteUrls: environment.remoteUrls,
    default_locale: 'fr-FR',
    debug: true,

    calendar_text: {
        days: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        today: 'Today',
        now: 'Now',
        am: 'AM',
        pm: 'PM'
    }
}


export default settings;