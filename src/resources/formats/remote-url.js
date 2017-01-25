import settings from '../../config/app-settings';

export class RemoteUrlValueConverter {
    toView(value) {
        return settings.rootUrl + '/' + value;
    }
}