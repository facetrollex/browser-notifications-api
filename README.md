# Browser Notifications API package

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
    // default values will be used for any
    // missed option
});

// Manual Request for Permissions
let notificationPermission = await notificationsAPI.askForPermission();

// Display Notification
const customNotifcation = notificationsAPI.showNotification({
    // single notification config
}); 
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
        tag: '', // string, identifying tag for the notification
        onShow: null, // function, executed once notification is displayed
        onClick: null, // function, executed once user clicked on notification 
        onClose: null, // function, executed once user closed notification
        onError: null // function, executed on error
    }
};
```



> [!NOTE]
> Useful information that users should know, even when skimming content.

> [!TIP]
> Helpful advice for doing things better or more easily.

> [!IMPORTANT]
> Key information users need to know to achieve their goal.

> [!WARNING]
> Urgent info that needs immediate user attention to avoid problems.

> [!CAUTION]
> Advises about risks or negative outcomes of certain actions.
