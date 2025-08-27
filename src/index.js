'use strict';

import NotificationPermissions from './permissions'
import { PERMISSION_STATES } from './permissions';

let isSupported = false;

class BrowserNotificationsAPI {
    #notificationPermissions;
    #config = {
        permissions: {
            askOn: 'init', // Not implemented
            askOneTime: true,
            onGranted: () => {
                console.warn('Global On Granted');
            },
            onDenied: () => {
                console.warn('Global On Denied');
            },
        },
        disableOnActiveWindow: true, //TODO: handle - Do not display notification once window is active, move to permissions
        notificationOptions: { // TODO: handle this
            title: 'Global Title',
            body: 'Global Body',
        }
    }

    constructor(config) {
        isSupported = ('Notification' in window);

        this.#notificationPermissions = new NotificationPermissions(this.#config.permissions);

        if (!isSupported) {
            throw new Error('Notifications not supported by browser.');
        }

        return this;
    }

    get config() {
        return this.#config;
    }

    set config(value) {
        throw new Error('Config property is read-only.');
    }

    showNotification(title, options) {
        const perm = this.#notificationPermissions.getPermission();
        let notification = null;

        if (perm === PERMISSION_STATES.DENIED) {
            throw Error('Notification permission denied');
        }

        if (perm === PERMISSION_STATES.DEFAULT) {
            //TODO:
            //Ask again?
        }

        if (perm === PERMISSION_STATES.GRANTED) {
            notification = new Notification(title, options);
        }

        return notification;
    }
}

export default BrowserNotificationsAPI;
