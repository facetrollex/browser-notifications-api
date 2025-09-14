'use strict';

class NotificationManager
{
    #notificationsSent = new Map();

    constructor() {}

    logNotification(notification) {
        if(this.#notificationsSent.has(notification.tag)) {
            const existing = this.#notificationsSent.get(notification.tag);
            existing.push(notification);
            this.#notificationsSent.set(notification.tag, existing);
        } else {
            this.#notificationsSent.set(notification.tag, [notification]);
        }
    }

    getAllNotifications() {
        return Object.fromEntries(this.#notificationsSent.entries());
    }

    getNotificationByTag(tag) {
        if(this.#notificationsSent.has(tag)) {
            return this.#notificationsSent.get(tag);
        }

        return null;
    }

    updateTag(tag) {
        if(!tag || typeof tag !== 'string') {
            tag = 'N_' + Date.now();
        }
        return tag;
    }
}

export default NotificationManager;
