class BrowserNotificationAPI {
    PERM_DEFAULT = 'default';
    PERM_DENIED = 'denied';
    PERM_GRANTED = 'granted';

    #permission = this.PERM_DEFAULT;

    #config = {
        requestOnInit: 1,
    }
    constructor() {

        if(!this.#isSupported()) {
            throw new Error('Notifications not supported by browser.');
        }

        if(this.#config.requestOnInit) {
            this.#requestPermission();
        }

        return this;
    }

    get config() {
        return this.#config;
    }

    set config(value) {
        throw new Error('Property is read-only');
    }

    #isSupported() {
        return 'Notification' in window;
    }

    showNotification(title, options) {
        let notification = null;
        if(this.#permission === this.PERM_DENIED) {
            throw Error('Notification permission denied');
        }

        if(this.#permission === this.PERM_DEFAULT) {
            //TODO:
            //Ask again?
        }

        if(this.#permission === this.PERM_GRANTED) {
            notification = new Notification(title, options);
        }

        return notification;
    }

    #requestPermission() {
        Notification.requestPermission().then((permission) => {
            this.#permission = permission;
        })
    }

    askForPermissions() {
        this.#requestPermission();
    }
}

export default BrowserNotificationAPI;
