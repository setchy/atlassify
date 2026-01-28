import { vi } from 'vitest';

import { mockSingleAtlassifyNotification } from '../__mocks__/notifications-mocks';

import * as logger from '../../shared/logger';

import { rendererLogError, rendererLogInfo, rendererLogWarn } from './logger';

describe('renderer/utils/logger.ts', () => {
  const logInfoSpy = vi.spyOn(logger, 'logInfo').mockImplementation();
  const logWarnSpy = vi.spyOn(logger, 'logWarn').mockImplementation();
  const logErrorSpy = vi.spyOn(logger, 'logError').mockImplementation();
  const mockError = new Error('boom');

  beforeEach(() => {
    logInfoSpy.mockReset();
    logWarnSpy.mockReset();
    logErrorSpy.mockReset();
  });

  it('logs info without notification', () => {
    rendererLogInfo('foo', 'bar');
    expect(logInfoSpy).toHaveBeenCalledWith('foo', 'bar', []);
  });

  it('logs info with notification', () => {
    rendererLogInfo('foo', 'bar', mockSingleAtlassifyNotification);
    expect(logInfoSpy).toHaveBeenCalledWith('foo', 'bar', [
      '#103: chore(deps): update dependency eslint',
      '#103: chore(deps): update dependency eslint',
    ]);
  });

  it('logs warn with notification', () => {
    rendererLogWarn('foo', 'bar', mockSingleAtlassifyNotification);
    expect(logWarnSpy).toHaveBeenCalledWith('foo', 'bar', [
      '#103: chore(deps): update dependency eslint',
      '#103: chore(deps): update dependency eslint',
    ]);
  });

  it('logs error with notification', () => {
    rendererLogError('foo', 'bar', mockError, mockSingleAtlassifyNotification);
    expect(logErrorSpy).toHaveBeenCalledWith('foo', 'bar', mockError, [
      '#103: chore(deps): update dependency eslint',
      '#103: chore(deps): update dependency eslint',
    ]);
  });
});
