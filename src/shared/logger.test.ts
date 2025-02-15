import log from 'electron-log';

import { mockSingleAtlassifyNotification } from '../renderer/__mocks__/notifications';
import { logError, logInfo, logWarn } from './logger';

describe('renderer/utils/logger.ts', () => {
  const logInfoSpy = vi.spyOn(log, 'info').mockImplementation(vi.fn());
  const logWarnSpy = vi.spyOn(log, 'warn').mockImplementation(vi.fn());
  const logErrorSpy = vi.spyOn(log, 'error').mockImplementation(vi.fn());

  const mockError = new Error('baz');

  beforeEach(() => {
    logInfoSpy.mockReset();
    logWarnSpy.mockReset();
    logErrorSpy.mockReset();
  });

  describe('logInfo', () => {
    it('log info without notification', () => {
      logInfo('foo', 'bar');

      expect(logInfoSpy).toHaveBeenCalledTimes(1);
      expect(logInfoSpy).toHaveBeenCalledWith('[foo]', 'bar');
    });

    it('log info with notification', () => {
      logInfo('foo', 'bar', mockSingleAtlassifyNotification);

      expect(logInfoSpy).toHaveBeenCalledTimes(1);
      expect(logInfoSpy).toHaveBeenCalledWith(
        '[foo]',
        'bar',
        '[#103: chore(deps): update dependency eslint >> #103: chore(deps): update dependency eslint]',
      );
    });
  });

  describe('logWarn', () => {
    it('log warn without notification', () => {
      logWarn('foo', 'bar');

      expect(logWarnSpy).toHaveBeenCalledTimes(1);
      expect(logWarnSpy).toHaveBeenCalledWith('[foo]', 'bar');
    });

    it('log warn with notification', () => {
      logWarn('foo', 'bar', mockSingleAtlassifyNotification);

      expect(logWarnSpy).toHaveBeenCalledTimes(1);
      expect(logWarnSpy).toHaveBeenCalledWith(
        '[foo]',
        'bar',
        '[#103: chore(deps): update dependency eslint >> #103: chore(deps): update dependency eslint]',
      );
    });
  });

  describe('logError', () => {
    it('log error without notification', () => {
      logError('foo', 'bar', mockError);

      expect(logErrorSpy).toHaveBeenCalledTimes(1);
      expect(logErrorSpy).toHaveBeenCalledWith('[foo]', 'bar', mockError);
    });

    it('log error with notification', () => {
      logError('foo', 'bar', mockError, mockSingleAtlassifyNotification);

      expect(logErrorSpy).toHaveBeenCalledTimes(1);
      expect(logErrorSpy).toHaveBeenCalledWith(
        '[foo]',
        'bar',
        '[#103: chore(deps): update dependency eslint >> #103: chore(deps): update dependency eslint]',
        mockError,
      );
    });
  });
});
