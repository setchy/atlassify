import { EVENTS } from '../../shared/events';

import { registerStorageHandlers } from './storage';

const handleMock = vi.fn();
const encryptStringAsyncMock = vi.fn();
const decryptStringAsyncMock = vi.fn();

vi.mock('electron', () => ({
  ipcMain: {
    handle: (...args: unknown[]) => handleMock(...args),
  },
  safeStorage: {
    encryptStringAsync: (...args: unknown[]) => encryptStringAsyncMock(...args),
    decryptStringAsync: (...args: unknown[]) => decryptStringAsyncMock(...args),
  },
}));

const logErrorMock = vi.fn();
vi.mock('../../shared/logger', () => ({
  logError: (...args: unknown[]) => logErrorMock(...args),
}));

function getHandler(event: string) {
  registerStorageHandlers();

  return handleMock.mock.calls.find((call: [string]) => call[0] === event)?.[1];
}

describe('main/handlers/storage.ts', () => {
  describe('registerStorageHandlers', () => {
    it('registers handlers without throwing', () => {
      expect(() => registerStorageHandlers()).not.toThrow();
    });

    it('registers expected storage IPC event handlers', () => {
      registerStorageHandlers();

      const registeredHandlers = handleMock.mock.calls.map(
        (call: [string]) => call[0],
      );

      expect(registeredHandlers).toContain(EVENTS.SAFE_STORAGE_ENCRYPT);
      expect(registeredHandlers).toContain(EVENTS.SAFE_STORAGE_DECRYPT);
    });

    it('encrypts values and returns them as base64', async () => {
      encryptStringAsyncMock.mockResolvedValue(Buffer.from('encrypted'));
      const handler = getHandler(EVENTS.SAFE_STORAGE_ENCRYPT);

      await expect(handler?.({}, 'plain')).resolves.toBe(
        Buffer.from('encrypted').toString('base64'),
      );
      expect(encryptStringAsyncMock).toHaveBeenCalledWith('plain');
    });

    it('decrypts values', async () => {
      decryptStringAsyncMock.mockResolvedValue({
        shouldReEncrypt: false,
        result: 'plain',
      });
      const handler = getHandler(EVENTS.SAFE_STORAGE_DECRYPT);

      await expect(handler?.({}, 'encrypted')).resolves.toBe('plain');
      expect(decryptStringAsyncMock).toHaveBeenCalledWith(
        Buffer.from('encrypted', 'base64'),
      );
    });

    it('re-decrypts values when the key should be rotated', async () => {
      decryptStringAsyncMock
        .mockResolvedValueOnce({ shouldReEncrypt: true, result: 'stale' })
        .mockResolvedValueOnce({ shouldReEncrypt: false, result: 'plain' });
      const handler = getHandler(EVENTS.SAFE_STORAGE_DECRYPT);

      await expect(handler?.({}, 'encrypted')).resolves.toBe('plain');
      expect(decryptStringAsyncMock).toHaveBeenCalledTimes(2);
    });

    it('logs and rethrows decryption errors', async () => {
      const error = new Error('decrypt failed');
      decryptStringAsyncMock.mockRejectedValue(error);
      const handler = getHandler(EVENTS.SAFE_STORAGE_DECRYPT);

      await expect(handler?.({}, 'encrypted')).rejects.toThrow(error);
      expect(logErrorMock).toHaveBeenCalledWith(
        'main:safe-storage-decrypt',
        'Failed to decrypt value - data may be from old build',
        error,
      );
    });
  });
});
