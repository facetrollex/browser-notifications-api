import BrowserNotificationsAPI from '../src/index';

// Mock the permissions module
jest.mock('../src/permissions', () => {
    const originalModule = jest.requireActual('../src/permissions');

    return {
        __esModule: true,
        ...originalModule,
        default: jest.fn().mockImplementation((config) => {
            return {
                getPermission: jest.fn().mockReturnValue(originalModule.PERMISSION_STATES.GRANTED),
                canShow: jest.fn().mockReturnValue(true),
                askForPermissions: jest.fn().mockResolvedValue(originalModule.PERMISSION_STATES.GRANTED)
            };
        })
    };
});

describe('BrowserNotificationsAPI', () => {
    let mockNotification;
    let originalNotification;
    let originalWindow;

    beforeEach(() => {
        // Store original globals
        originalNotification = global.Notification;
        originalWindow = global.window;

        // Create mock notification
        mockNotification = jest.fn();
        mockNotification.requestPermission = jest.fn().mockResolvedValue('granted');
        mockNotification.permission = 'granted';

        // Mock global objects
        global.Notification = mockNotification;
        global.window = {
            isSecureContext: true,
            Notification: mockNotification
        };

        // Mock document.hidden
        Object.defineProperty(document, 'hidden', {
            value: true,
            writable: true,
            configurable: true
        });
    });

    afterEach(() => {
        // Restore original globals
        global.Notification = originalNotification;
        global.window = originalWindow;
        jest.clearAllMocks();
    });

    describe('Constructor', () => {
        it('should throw error when not in browser environment', () => {
            // Temporarily remove window
            const windowBackup = global.window;
            delete global.window;

            expect(() => new BrowserNotificationsAPI()).toThrow('Secure Context Required, check for details: https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts');

            // Restore window
            global.window = windowBackup;
        });

        it('should throw error when notifications not supported', () => {
            const notificationBackup = global.Notification;
            delete global.Notification;

            expect(() => new BrowserNotificationsAPI()).toThrow('Notifications not supported by browser.');

            // Restore Notification
            global.Notification = notificationBackup;
        });

        it('should throw error when not secure context', () => {
            global.window.isSecureContext = false;

            expect(() => new BrowserNotificationsAPI()).toThrow('Secure Context Required');

            // Restore secure context
            global.window.isSecureContext = true;
        });
    });

    describe('showNotification', () => {
        it('should throw error when permission is denied', () => {
            // Mock permission denied
            const permissions = require('../src/permissions');
            permissions.default.mockImplementationOnce(() => ({
                getPermission: jest.fn().mockReturnValue('denied'),
                canShow: jest.fn().mockReturnValue(false),
                askForPermissions: jest.fn().mockResolvedValue('denied')
            }));

            const api = new BrowserNotificationsAPI();

            expect(() => api.showNotification({ title: 'Test' })).toThrow('Notification permission denied.');
        });

        it('should create notification when permission is granted', () => {
            const mockInstance = { onclick: null };
            mockNotification.mockImplementation(() => mockInstance);

            const api = new BrowserNotificationsAPI();
            const result = api.showNotification({ title: 'Test' });

            expect(mockNotification).toHaveBeenCalledWith('Test', expect.any(Object));
            expect(result).toBe(mockInstance);
        });
    });

    describe('askForPermission', () => {
        it('should delegate to permissions module', async () => {
            const api = new BrowserNotificationsAPI();
            const result = await api.askForPermission();

            expect(result).toBe('granted');
        });
    });

    describe('Event Handling', () => {
        it('should attach event handlers to notifications', () => {
            const mockHandlers = {
                onClick: jest.fn(),
                onShow: jest.fn(),
                onClose: jest.fn(),
                onError: jest.fn()
            };

            const mockInstance = {};
            mockNotification.mockImplementation(() => mockInstance);

            const api = new BrowserNotificationsAPI();
            api.showNotification({ title: 'Test', ...mockHandlers });

            expect(mockInstance.onclick).toBe(mockHandlers.onClick);
            expect(mockInstance.onshow).toBe(mockHandlers.onShow);
            expect(mockInstance.onclose).toBe(mockHandlers.onClose);
            expect(mockInstance.onerror).toBe(mockHandlers.onError);
        });
    });
});
