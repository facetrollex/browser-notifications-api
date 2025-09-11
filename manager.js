'use strict';

class NotificationManager
{
    constructor() {}

    updateTag(tag) {
        if(!tag || typeof tag !== 'string') {
            tag = 'N_' + Date.now();
        }
        return tag;
    }
}

export default NotificationManager;
