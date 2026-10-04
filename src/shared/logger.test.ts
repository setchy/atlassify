import log from 'electron-log';

import { logError, logInfo, logWarn, toError } from './logger';

describe('shared/logger.ts', () => {
  const logInfoSpy = vi.spyOn(log, 'info').mockImplementation(vi.fn());
  const logWarnSpy = vi.spyOn(log, 'warn').mockImplementation(vi.fn());
  const logErrorSpy = vi.spyOn(log, 'error').mockImplementation(vi.fn());

  const mockError = new Error('baz');

  describe('logInfo', () => {
    it('logs info without contexts', () => {
      logInfo('foo', 'bar');

      expect(logInfoSpy).toHaveBeenCalledTimes(1);
      expect(logInfoSpy).toHaveBeenCalledWith('[foo]', 'bar');
    });

    it('logs info with single context', () => {
      logInfo('foo', 'bar', ['ctx']);

      expect(logInfoSpy).toHaveBeenCalledTimes(1);
      expect(logInfoSpy).toHaveBeenCalledWith('[foo]', 'bar', '[ctx]');
    });

    it('logs info with multiple contexts', () => {
      logInfo('foo', 'bar', ['ctx1', 'ctx2']);

      expect(logInfoSpy).toHaveBeenCalledTimes(1);
      expect(logInfoSpy).toHaveBeenCalledWith('[foo]', 'bar', '[ctx1 >> ctx2]');
    });
  });

  describe('logWarn', () => {
    it('logs warn without contexts', () => {
      logWarn('foo', 'bar');

      expect(logWarnSpy).toHaveBeenCalledTimes(1);
      expect(logWarnSpy).toHaveBeenCalledWith('[foo]', 'bar');
    });

    it('logs warn with single context', () => {
      logWarn('foo', 'bar', ['ctx']);

      expect(logWarnSpy).toHaveBeenCalledTimes(1);
      expect(logWarnSpy).toHaveBeenCalledWith('[foo]', 'bar', '[ctx]');
    });

    it('logs warn with multiple contexts', () => {
      logWarn('foo', 'bar', ['ctx1', 'ctx2']);
      expect(logWarnSpy).toHaveBeenCalledTimes(1);
      expect(logWarnSpy).toHaveBeenCalledWith('[foo]', 'bar', '[ctx1 >> ctx2]');
    });
  });

  describe('logError', () => {
    it('logs error without contexts', () => {
      logError('foo', 'bar', mockError);

      expect(logErrorSpy).toHaveBeenCalledTimes(1);
      expect(logErrorSpy).toHaveBeenCalledWith('[foo]', 'bar', mockError);
    });

    it('logs error with single context', () => {
      logError('foo', 'bar', mockError, ['ctx']);

      expect(logErrorSpy).toHaveBeenCalledTimes(1);
      expect(logErrorSpy).toHaveBeenCalledWith(
        '[foo]',
        'bar',
        '[ctx]',
        mockError,
      );
    });

    it('logs error with multiple contexts', () => {
      logError('foo', 'bar', mockError, ['ctx1', 'ctx2']);

      expect(logErrorSpy).toHaveBeenCalledTimes(1);
      expect(logErrorSpy).toHaveBeenCalledWith(
        '[foo]',
        'bar',
        '[ctx1 >> ctx2]',
        mockError,
      );
    });
  });

  describe('toError', () => {
    it('returns the same Error instance when passed an Error', () => {
      const err = new Error('boom');
      expect(toError(err)).toBe(err);
    });

    it('wraps a string value in an Error', () => {
      expect(toError('boom')).toEqual(new Error('boom'));
    });

    it('stringifies non-string values for the error message', () => {
      expect(toError(42).message).toBe('42');
      expect(toError({ code: 1 }).message).toBe('{"code":1}');
    });

    it('falls back to a generic message for undefined', () => {
      expect(toError(undefined).message).toBe('Unknown error');
    });
  });
});
