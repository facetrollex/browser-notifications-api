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
            disableOnActiveWindow: true,
            onGranted: () => {},
            onDenied: () => {},
        },
        notificationOptions: { // TODO: handle this
            title: 'Global Title',
            body: 'Global Body',
        }
    }

    constructor(config) {
        this.#config = {
            ...this.#config, // redundantly for now.
            ...config, // redundantly for now.
            permissions: {
                ...this.#config.permissions,
                ...config?.permissions
            },
            notificationOptions: {
                ...this.#config.notificationOptions,
                ...config?.notificationOptions
            }
        };


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

        if (perm === PERMISSION_STATES.GRANTED && this.#notificationPermissions.canShow()) {
            notification = new Notification(title, options);
        }

        return notification;
    }
}

export default BrowserNotificationsAPI;
