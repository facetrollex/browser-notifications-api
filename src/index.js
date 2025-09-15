'use strict';

import NotificationPermissions from './permissions';
import NotificationManager from './manager';
import { PERMISSION_STATES, PERMISSION_REQUEST_STRATEGIES } from './permissions';

class BrowserNotificationsAPI {
    #notificationPermissions;
    #notificationManager;
    #config = {
        permissions: {
            askOn: PERMISSION_REQUEST_STRATEGIES.ON_INIT,
            askOneTime: true,
            disableOnActiveWindow: true,
            onGranted: null,
            onDenied: null
        },
        notificationOptions: {
            title: '',
            body: '',
            badge: '', // for mobile devices
            data: null,
            dir: 'auto', // 'ltr', 'rtl'.
            icon: '',
            image: null, // limited, experimental.
            requireInteraction: false, // Limited availability
            silent: null,
            tag: '', //string, if empty 'N_timestamp' will be used by default
            //renotify: false, // Limited availability, experimental, tag required
            //actions:  [], // experimental, serviceWorker Required.
            //Actions are only supported for persistent notifications shown using ServiceWorkerRegistration.showNotification()
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

        this.#checkAvailability();
        this.#notificationPermissions = new NotificationPermissions(this.#config.permissions);
        this.#notificationManager = new NotificationManager();
    }

    get config() {
        return this.#config;
    }

    set config(value) {
        throw new Error('Config property is read-only.');
    }

    showNotification(options) {
        const perm = this.#notificationPermissions.getPermission();
        let notification = null;

        options = { ...this.#config.notificationOptions, ...options };

        if (perm === PERMISSION_STATES.DENIED) {
            throw Error('Notification permission denied.');
        }

        if (perm === PERMISSION_STATES.DEFAULT) {
            if(this.#config.permissions.askOn === PERMISSION_REQUEST_STRATEGIES.ON_FIRST_NOTIFICATION) {
                this.askForPermission().then((permission) => {
                    if(permission === PERMISSION_STATES.GRANTED) {
                        this.showNotification(options);
                    } else {
                        throw Error('Notification permission not granted.')
                    }
                });
            } else {
                throw Error('Notification permission not granted.');
            }
        }

        if (perm === PERMISSION_STATES.GRANTED && this.#notificationPermissions.canShow()) {
            options.tag = this.#notificationManager.updateTag(options.tag);

            notification = new Notification(options.title, options);

            this.#notificationManager.logNotification(notification);

            this.#handleNotificationEvents(notification, options);
        }

        return notification;
    }

    async askForPermission() {
        return this.#notificationPermissions.askForPermissions();
    }

    getAllNotifications() {
        return this.#notificationManager.getAllNotifications();
    }

    getNotificationByTag(tag) {
        return this.#notificationManager.getNotificationByTag(tag);
    }

    permissionRequestButton(options) {
        return this.#notificationPermissions.permissionRequestBtn(options);
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

    #checkAvailability() {
        if(!window) {
            throw new Error('Browser window not defined.');
        }

        if (!('Notification' in window)) {
            throw new Error('Notifications not supported by browser.');
        }

        if(!window.isSecureContext) {
            throw new Error('Secure Context Required, check for details: https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts');
        }
    }
}

export default BrowserNotificationsAPI;
