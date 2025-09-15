'use strict';

const PERMISSION_STATES = Object.freeze({
    DEFAULT: 'default',
    DENIED: 'denied',
    GRANTED: 'granted'
});

const PERMISSION_REQUEST_STRATEGIES = Object.freeze({
    ON_INIT: 'init',
    ON_FIRST_NOTIFICATION: 'on_first_notification',
    MANUAL: 'manual'
});

class NotificationPermissions {

    #config;
    #permission = PERMISSION_STATES.DEFAULT;
    #permissionRequested = false;

    constructor(config) {
        this.#config = config;

        if(this.#config.askOn === PERMISSION_REQUEST_STRATEGIES.ON_INIT) {
            this.askForPermissions();
        }
    }

    getPermission() {
        return this.#permission;
    }

    canShow() {
        return (this.#config.disableOnActiveWindow && document.hidden) || !this.#config.disableOnActiveWindow;
    }

    async askForPermissions() {
        if(this.#config.askOneTime && !this.#permissionRequested) {
            return await this.#requestPermission();
        } else if(!this.#config.askOneTime) {
            return await this.#requestPermission();
        } else {
            throw Error('Permissions already asked, state: ' + this.#permission);
        }
    }

    permissionRequestBtn(options) {
        const defaultOptions = {
            text: 'Enable Notifications',
            id: null,
            classList: [],
            attributes: {
                type: 'button'
            },
            appendTo: null,
            removeOnGranted: true,
            onClick: null
        };

        options = {
            ...defaultOptions,
            ...options,
            attributes: {...defaultOptions.attributes, ...options.attributes}
        };

        const btn = document.createElement('button');

        btn.textContent = options.text;

        if(options.id) {
            btn.id = options.id;
        }

        if(options.classList) {
            options.classList.forEach((className) => {
                btn.classList.add(className);
            })
        }

        Object.keys(options.attributes).forEach((key) => {
            btn.setAttribute(key, options.attributes[key]);
        });

        btn.addEventListener('click', async () => {
            const perm = await this.askForPermissions();

            if(typeof options.onClick === 'function') {
                options.onClick();
            }

            if(perm === PERMISSION_STATES.GRANTED && options.removeOnGranted) {
                btn.remove();
            }
        });

        if (options.appendTo) {
            if(options.appendTo instanceof HTMLElement) {
                options.appendTo.appendChild(btn);
            } else if(typeof options.appendTo === 'string') {
                const container = document.getElementById(options.appendTo);
                if(container) {
                    container.appendChild(btn);
                }
            }
        }

        return btn;
    }

    async #requestPermission() {
        this.#permission = await Notification.requestPermission();
        this.#handleEvents();
        return this.#permission;
    }

    #handleEvents() {
        this.#permissionRequested = true;

        if(this.#permission === PERMISSION_STATES.GRANTED && typeof this.#config.onGranted === 'function') {
            this.#config.onGranted();
        }

        if(this.#permission === PERMISSION_STATES.DENIED && typeof this.#config.onDenied === 'function') {
            this.#config.onDenied();
        }
    }
}

export default NotificationPermissions;
export { PERMISSION_STATES, PERMISSION_REQUEST_STRATEGIES };
