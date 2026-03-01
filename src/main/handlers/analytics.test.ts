import { beforeEach, describe, expect, it, vi } from 'vitest';

import { EVENTS } from '../../shared/events';

import { initializeAnalytics, registerAnalyticsHandlers } from './analytics';

const handleMock = vi.fn();

vi.mock('electron', () => ({
  ipcMain: {
    handle: (...args: unknown[]) => handleMock(...args),
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
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    handleMock.mockClear();
    process.env = { ...originalEnv };
  });

  describe('initializeAnalytics', () => {
    it('logs an error and skips initialization when APTABASE_KEY is not set', async () => {
      delete process.env.APTABASE_KEY;

      await initializeAnalytics();

      expect(initializeMock).not.toHaveBeenCalled();
      expect(logErrorMock).toHaveBeenCalledWith(
        'analytics',
        'APTABASE_KEY environment variable is not set',
        expect.any(Error),
      );
    });

    it('initializes the SDK and logs success when APTABASE_KEY is set', async () => {
      process.env.APTABASE_KEY = 'test-key-123';

      await initializeAnalytics();

      expect(initializeMock).toHaveBeenCalledWith('test-key-123');
      expect(logInfoMock).toHaveBeenCalledWith(
        'analytics',
        'Aptabase initialized successfully',
      );
      expect(logErrorMock).not.toHaveBeenCalled();
    });

    it('logs an error when SDK initialization throws', async () => {
      process.env.APTABASE_KEY = 'test-key-123';
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

      const registeredHandlers = handleMock.mock.calls.map(
        (call: [string]) => call[0],
      );

      expect(registeredHandlers).toContain(EVENTS.APTABASE_TRACK_EVENT);
    });

    it('calls trackEvent with the correct arguments when the handler is invoked', () => {
      registerAnalyticsHandlers();

      const handlerCallback = handleMock.mock.calls.find(
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

      const handlerCallback = handleMock.mock.calls.find(
        (call: [string]) => call[0] === EVENTS.APTABASE_TRACK_EVENT,
      )?.[1];

      handlerCallback(null, { eventName: 'Settings', props: undefined });

      expect(trackEventMock).toHaveBeenCalledWith('Settings', undefined);
    });
  });
});
