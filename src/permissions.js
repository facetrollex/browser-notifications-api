'use strict';

const PERMISSION_STATES = Object.freeze({
    DEFAULT: 'default',
    DENIED: 'denied',
    GRANTED: 'granted'
});

class NotificationPermissions {
    #permissionRequested = false;
    #config;
    #permission = PERMISSION_STATES.DEFAULT;

    constructor(config) {
        this.#config = config;

        // TODO: Temp Mode - ask on init
        this.askForPermissions();
    }

    getPermission() {
        return this.#permission;
    }

    async askForPermissions() {
        if(this.#config.askOneTime && !this.#permissionRequested) {
            await this.#requestPermission();
        } else if(!this.#config.askOneTime) {
            await this.#requestPermission();
        } else {
            throw Error('Permissions already asked, state: ' + this.#permission);
        }

    }

    async #requestPermission() {
        this.#permission = await Notification.requestPermission();
        this.#handleEvents();
    }

    #handleEvents() {
        this.#permissionRequested = true;

        //TODO make sure events is functions;
        if(this.#permission === PERMISSION_STATES.GRANTED) {
            this.#config.onGranted();
        }

        if(this.#permission === PERMISSION_STATES.DENIED) {
            this.#config.onDenied();
        }
    }
}

export default NotificationPermissions;
export { PERMISSION_STATES };
