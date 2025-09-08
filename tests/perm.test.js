import NotificationPermissions from '../src/permissions';

describe('NotificationPermissions', () => {
    let mockConfig;
    let originalNotification;

    beforeEach(() => {
        originalNotification = global.Notification;
        global.Notification = {
            requestPermission: jest.fn()
        };

        mockConfig = {
            askOn: 'init',
            askOneTime: true,
            disableOnActiveWindow: true,
            onGranted: jest.fn(),
            onDenied: jest.fn()
        };

        // Mock document.hidden with a writable property
        Object.defineProperty(document, 'hidden', {
            value: true,
            writable: true,
            configurable: true
        });
    });

    afterEach(() => {
        global.Notification = originalNotification;
    });

    describe('Constructor', () => {
        it('should request permission on init when configured', () => {
            Notification.requestPermission.mockResolvedValue('granted');
            new NotificationPermissions(mockConfig);
            expect(Notification.requestPermission).toHaveBeenCalled();
        });

        it('should not request permission when strategy is manual', () => {
            mockConfig.askOn = 'manual';
            new NotificationPermissions(mockConfig);
            expect(Notification.requestPermission).not.toHaveBeenCalled();
        });
    });

    describe('getPermission', () => {
        it('should return current permission state', async () => {
            Notification.requestPermission.mockResolvedValue('granted');
            const permissions = new NotificationPermissions(mockConfig);
            await new Promise(process.nextTick);
            expect(permissions.getPermission()).toBe('granted');
        });
    });

    describe('canShow', () => {
        it('should return true when window is not active and disableOnActiveWindow is true', () => {
            document.hidden = true;
            const permissions = new NotificationPermissions(mockConfig);
            expect(permissions.canShow()).toBe(true);
        });

        it('should return false when window is active and disableOnActiveWindow is true', () => {
            document.hidden = false;
            const permissions = new NotificationPermissions(mockConfig);
            expect(permissions.canShow()).toBe(false);
        });

        it('should always return true when disableOnActiveWindow is false', () => {
            mockConfig.disableOnActiveWindow = false;
            const permissions = new NotificationPermissions(mockConfig);
            expect(permissions.canShow()).toBe(true);
        });
    });

    describe('askForPermissions', () => {
        it('should request permission when askOneTime is true and not requested before', async () => {
            Notification.requestPermission.mockResolvedValue('granted');
            const permissions = new NotificationPermissions({ ...mockConfig, askOn: 'manual' });

            const result = await permissions.askForPermissions();

            expect(result).toBe('granted');
            expect(Notification.requestPermission).toHaveBeenCalled();
        });

        it('should throw error when askOneTime is true and already requested', async () => {
            Notification.requestPermission.mockResolvedValue('granted');
            const permissions = new NotificationPermissions(mockConfig);
            await new Promise(process.nextTick);

            await expect(permissions.askForPermissions()).rejects.toThrow();
        });

        it('should always request when askOneTime is false', async () => {
            mockConfig.askOneTime = false;
            Notification.requestPermission.mockResolvedValue('granted');
            const permissions = new NotificationPermissions(mockConfig);

            await permissions.askForPermissions();
            await permissions.askForPermissions();

            expect(Notification.requestPermission).toHaveBeenCalledTimes(3); // Once in constructor, twice manually
        });
    });
});
