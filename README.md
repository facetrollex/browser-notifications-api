# Browser Notifications API package 
[![npm version](https://badge.fury.io/js/browser-notifications-api.svg)](https://badge.fury.io/js/browser-notifications-api)
![NPM License](https://img.shields.io/npm/l/browser-notifications-api)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/facetrollex/browser-notifications-api)

A lightweight wrapper for the native Browser Notifications API. Simplifies permission requests and notification display with a consistent, cross-browser interface. Perfect for PWAs, Alerts and User Engagement features.

---

## Installation

```bash
npm i browser-notifications-api
```

---
## Usage

###  Basic Example
```javascript
import BrowserNotificationsAPI from 'browser-notifications-api';

const notificationsAPI = new BrowserNotificationsAPI({
    // global configuration object
    // default value(s) will be used for any missed option
});

// Manual Request for Permissions
let notificationPermission = await notificationsAPI.askForPermission();

// Display Notification, return Notification instance
const customNotifcation = notificationsAPI.showNotification({
    // single notification config
    // check notificationOptions as reference
});

const allNotificationsSent = notificationsAPI.getAllNotifications();
//return object with all notifications with format: 'tag' -> [Notification, ... ]
// { 
//   N_1757860285783: [Notification],
//   N_1757860291945: [Notification],
//   test:[Notification, Notification, Notification]
// }

const notificationsByTag = notificationsAPI.getNotificationByTag('tag');
// return all notifications (array) related to tag, 'null' in case of empty result.
```

### Configuration
```javascript
// Default Configuration
const configuration = {
    permissions: {
        // permission request strategy
        askOn: 'init', // -> init, on_first_notification, manual
        askOneTime: true, // ask permissions only one time
        disableOnActiveWindow: true, // do not show notification once window is active
        onGranted: null, // function, executed once permission is granted
        onDenied: null // function, executed once permission is denied
    },
    notificationOptions: {
        title: '', // notification title
        body: '', // notification content
        badge: null, // URL of an image to represent the notification when there is not enough space to display the notification itself
        data: null, // object/array/string, can be used inside notification actions (click/close/etc)
        dir: 'auto', // text direction -> 'ltr', 'rtl'.
        icon: null, // URL of an icon to be displayed as part of the notification
        image: null, // URL of an image to be displayed as part of the notification
        requireInteraction: false, // boolean value indicating that a notification should remain active until the user clicks or dismisses it, rather than closing automatically
        silent: null, // https://developer.mozilla.org/en-US/docs/Web/API/Notification/silent
        tag: '', // string, identifying tag for the notification, if empty 'N_timestamp' will be used by default
        onShow: null, // function, executed once notification is displayed
        onClick: null, // function, executed once user clicked on notification 
        onClose: null, // function, executed once user closed notification
        onError: null // function, executed on error
    }
};
```

---

## Availability / Browser Compatibility
Browser Compatibility -> [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Notification#browser_compatibility)

> [!IMPORTANT]
>Secure Context is required, ref: [MDN](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts)
>
>Notification support is required

---

## Author
[Alexey Khamitsevich](mailto:alexey.khamitsevich@gmail.com)

---

## Licence
[MIT](LICENSE)
