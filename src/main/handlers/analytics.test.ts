import { EVENTS } from '../../shared/events';

import { initializeAnalytics, registerAnalyticsHandlers } from './analytics';

const onMock = vi.fn();

vi.mock('electron', () => ({
  ipcMain: {
    on: (...args: unknown[]) => onMock(...args),
  },
}));

const initializeMock = vi.fn();
const trackEventMock = vi.fn();
vi.mock('@aptabase/electron/main', () => ({
  initialize: (...args: unknown[]) => initializeMock(...args),
  trackEvent: (...args: unknown[]) => trackEventMock(...args),
}));

const logInfoMock = vi.fn();
const logErrorMock = vi.fn();
vi.mock('../../shared/logger', () => ({
  logInfo: (...args: unknown[]) => logInfoMock(...args),
  logError: (...args: unknown[]) => logErrorMock(...args),
}));

describe('main/handlers/analytics.ts', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('initializeAnalytics', () => {
    it('logs an error and skips initialization when VITE_APTABASE_KEY is not set', async () => {
      vi.stubEnv('VITE_APTABASE_KEY', '');

      await initializeAnalytics();

      expect(initializeMock).not.toHaveBeenCalled();
      expect(logErrorMock).toHaveBeenCalledWith(
        'analytics',
        'VITE_APTABASE_KEY environment variable is not set',
        expect.any(Error),
      );
    });

    it('initializes the SDK and logs success when VITE_APTABASE_KEY is set', async () => {
      vi.stubEnv('VITE_APTABASE_KEY', 'test-key-123');

      await initializeAnalytics();

      expect(initializeMock).toHaveBeenCalledWith('test-key-123');
      expect(logInfoMock).toHaveBeenCalledWith(
        'analytics',
        'Aptabase initialized successfully',
      );
      expect(logErrorMock).not.toHaveBeenCalled();
    });

    it('logs an error when SDK initialization throws', async () => {
      vi.stubEnv('VITE_APTABASE_KEY', 'test-key-123');
      const sdkError = new Error('SDK init failed');
      initializeMock.mockImplementationOnce(() => {
        throw sdkError;
      });

      await initializeAnalytics();

      expect(logErrorMock).toHaveBeenCalledWith(
        'analytics',
        'Failed to initialize Aptabase',
        sdkError,
      );
    });
  });

  describe('registerAnalyticsHandlers', () => {
    it('registers handlers without throwing', () => {
      expect(() => registerAnalyticsHandlers()).not.toThrow();
    });

    it('registers the APTABASE_TRACK_EVENT handler', () => {
      registerAnalyticsHandlers();

      const registeredEvents = onMock.mock.calls.map(
        (call: [string]) => call[0],
      );

      expect(registeredEvents).toContain(EVENTS.APTABASE_TRACK_EVENT);
    });

    it('calls trackEvent with the correct arguments when the handler is invoked', () => {
      registerAnalyticsHandlers();

      const handlerCallback = onMock.mock.calls.find(
        (call: [string]) => call[0] === EVENTS.APTABASE_TRACK_EVENT,
      )?.[1];

      handlerCallback(null, {
        eventName: 'Application',
        props: { event: 'Launched' },
      });

      expect(trackEventMock).toHaveBeenCalledWith('Application', {
        event: 'Launched',
      });
    });

    it('calls trackEvent without props when props are omitted', () => {
      registerAnalyticsHandlers();

      const handlerCallback = onMock.mock.calls.find(
        (call: [string]) => call[0] === EVENTS.APTABASE_TRACK_EVENT,
      )?.[1];

      handlerCallback(null, { eventName: 'Settings', props: undefined });

      expect(trackEventMock).toHaveBeenCalledWith('Settings', undefined);
    });
  });
});
