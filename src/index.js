const PERM_DEFAULT = 'default';
const PERM_DENIED = 'denied';
const PERM_GRANTED = 'granted';


//TODO - Implement This.
const ASK_ON_CLASS_INIT = 'on_class_init';
const ASK_ON_FIRST_NOTIFICATION = 'on_first_notification';
const ASK_MANUAL = 'manual';
class BrowserNotificationsAPI {
    #permission = PERM_DEFAULT;
    #isSupported = null;
    #permissionsAsked = false;
    #config = {
        requestOnInit: 1, //Ask for Permissions on class init.
        askPermissionsOn: 1, // TODO handle different types
        askPermissionsOneTime: 1,
        disableOnActiveWindow: true, //TODO: handle - Do not display notification once window is active
        notificationOptions: { // TODO: handle this
            title: 'Global Title',
            body: 'Global Body',
        }
    }

    constructor() {
        if(!this.isSupported) {
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
        throw new Error('Config property is read-only.');
    }

    get isSupported() {
        if(this.#isSupported == null) {
            this.#isSupported = ('Notification' in window);
        }
        return this.#isSupported;
    }

    set isSupported(value) {
        if(this.#isSupported === null) {
            this.#isSupported = value; // Set only once.
        }
    }

    showNotification(title, options) {
        let notification = null;
        if(this.#permission === PERM_DENIED) {
            throw Error('Notification permission denied');
        }

        if(this.#permission === PERM_DEFAULT) {
            //TODO:
            //Ask again?
        }

        if(this.#permission === PERM_GRANTED) {
            notification = new Notification(title, options);
        }

        return notification;
    }

    #handlePermissions() {
        this.#permissionsAsked = true;
    }

    #requestPermission() {
        if(!this.#permissionsAsked) {
            Notification.requestPermission().then((permission) => {
                this.#permission = permission;
                this.#permissionsAsked = true;
            });
        }
    }

    askForPermissions() {
        this.#requestPermission();
    }
}

export default BrowserNotificationsAPI;
