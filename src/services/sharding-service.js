import { singleton } from 'aurelia-framework';
import settings from '../config/app-settings';

const MAX_CONNECTIONS = 6;

@singleton(false)

/**
 * Service to retrieve remote Url based on the list of domains
 * in the list in settings.
 * Allows to connect to the remote host using different domain names
 * in order to circumvent the browser's limitation of maximum number of open connections
 * to a remote host name
 */
export class ShardingService {
    
    curIndex = 0;
    curConnections = 0;

    getRemoteUrl() {

        if (this.curConnections >= MAX_CONNECTIONS) {
            this.curConnections = 0;
            this.curIndex++;
        }

        //if we used all hosts, go back to the first one and cross fingers
        if (this.curIndex === settings.remoteUrls.length) {
            this.curIndex = 0;
        }

        this.curConnections++;
        return settings.remoteUrls[this.curIndex];
    }
}