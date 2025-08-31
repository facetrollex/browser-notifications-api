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
            onGranted: null, //on granted action
            onDenied: null, //on denied action
        },
        notificationOptions: { // TODO: handle this
            title: 'Global Title',
            body: 'Global Body',
            // data: { // secure context
            //     name: 'Hello',
            //     email: 'world',
            // },
            requireInteraction: false, // Limited availability, secure context
            //renotify: false, // Limited availability, secure context, experimental, tag required
            //actions:  [{action: 'test', title: 'test'}], //Todo: secure context required, experimental
            //Actions are only supported for persistent notifications shown using ServiceWorkerRegistration.showNotification()
            //tag: null,
            onShow: null,
            onClick: null,
            onClose: null,
            onError: null
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

        options = { ...this.#config.notificationOptions, ...options };

        if (perm === PERMISSION_STATES.DENIED) {
            throw Error('Notification permission denied');
        }

        if (perm === PERMISSION_STATES.DEFAULT) {
            //TODO:
            //Ask again?
        }

        if (perm === PERMISSION_STATES.GRANTED && this.#notificationPermissions.canShow()) {
            notification = new Notification(title, options);
            this.#handleNotificationEvents(notification, options);
        }

        return notification;
    }

    #handleNotificationEvents(Notification, options) {
        if(typeof options.onClick === 'function') {
            Notification.onclick = options.onClick;
        }

        if(typeof options.onShow === 'function') {
            Notification.onshow = options.onShow;
        }

        if(typeof options.onClose === 'function') {
            Notification.onclose = options.onClose;
        }

        if(typeof options.onError === 'function') {
            Notification.onerror = options.onError;
        }
    }
}

export default BrowserNotificationsAPI;
