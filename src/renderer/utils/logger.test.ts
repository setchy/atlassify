import log from 'electron-log';

import { mockSingleAtlassifyNotification } from '../__mocks__/notifications-mocks';
import { rendererLogError, rendererLogInfo, rendererLogWarn } from '../logger';

describe('renderer/logger.ts', () => {
  const logInfoSpy = jest.spyOn(log, 'info').mockImplementation();
  const logWarnSpy = jest.spyOn(log, 'warn').mockImplementation();
  const logErrorSpy = jest.spyOn(log, 'error').mockImplementation();
  const mockError = new Error('boom');

  beforeEach(() => {
    logInfoSpy.mockReset();
    logWarnSpy.mockReset();
    logErrorSpy.mockReset();
  });

  it('logs info without notification', () => {
    rendererLogInfo('foo', 'bar');
    expect(logInfoSpy).toHaveBeenCalledWith('[foo]', 'bar');
  });

  it('logs info with notification', () => {
    rendererLogInfo('foo', 'bar', mockSingleAtlassifyNotification);
    expect(logInfoSpy).toHaveBeenCalledWith(
      '[foo]',
      'bar',
      '[#103: chore(deps): update dependency eslint >> #103: chore(deps): update dependency eslint]',
    );
  });

  it('logs warn with notification', () => {
    rendererLogWarn('foo', 'bar', mockSingleAtlassifyNotification);
    expect(logWarnSpy).toHaveBeenCalledWith(
      '[foo]',
      'bar',
      '[#103: chore(deps): update dependency eslint >> #103: chore(deps): update dependency eslint]',
    );
  });

  it('logs error with notification', () => {
    rendererLogError('foo', 'bar', mockError, mockSingleAtlassifyNotification);
    expect(logErrorSpy).toHaveBeenCalledWith(
      '[foo]',
      'bar',
      '[#103: chore(deps): update dependency eslint >> #103: chore(deps): update dependency eslint]',
      mockError,
    );
  });
});
