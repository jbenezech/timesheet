var settings = {
    rootUrl: '',
    envUrlPrefix: '',
    baseUrl: '',
    default_locale: 'km-KH',
    debug: false,
    country: 1,
    view_notifications_timeout: 5000,

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

settings.rootUrl = 'http://timesheet.local';
settings.envUrlPrefix = '/app_dev.php';
settings.baseUrl = settings.rootUrl + settings.envUrlPrefix;
settings.debug = true;

export default settings;