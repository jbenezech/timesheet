import { singleton } from 'aurelia-framework';
import settings from '../config/app-settings';

const MAX_CONNECTIONS = 6;

@singleton(false)
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