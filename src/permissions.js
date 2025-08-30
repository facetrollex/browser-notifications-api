'use strict';

const PERMISSION_STATES = Object.freeze({
    DEFAULT: 'default',
    DENIED: 'denied',
    GRANTED: 'granted'
});

class NotificationPermissions {

    #config;
    #permission = PERMISSION_STATES.DEFAULT;
    #permissionRequested = false;

    constructor(config) {
        this.#config = config;

        // TODO: Temp Mode - ask on init
        this.askForPermissions();
    }

    getPermission() {
        return this.#permission;
    }

    canShow() {
        return (this.#config.disableOnActiveWindow && document.hidden) || !this.#config.disableOnActiveWindow;
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

        if(this.#permission === PERMISSION_STATES.GRANTED && typeof this.#config.onGranted === 'function') {
            this.#config.onGranted();
        }

        if(this.#permission === PERMISSION_STATES.DENIED && typeof this.#config.onDenied === 'function') {
            this.#config.onDenied();
        }
    }
}

export default NotificationPermissions;
export { PERMISSION_STATES };
