import { beforeEach, describe, expect, it, vi } from 'vitest';

const handleMock = vi.fn();

vi.mock('electron', () => ({
  ipcMain: {
    handle: (...args: unknown[]) => handleMock(...args),
  },
  safeStorage: {
    encryptString: vi.fn((str: string) => Buffer.from(str)),
    decryptString: vi.fn((buf: Buffer) => buf.toString()),
  },
}));

const logErrorMock = vi.fn();
vi.mock('../../shared/logger', () => ({
  logError: (...args: unknown[]) => logErrorMock(...args),
}));

describe('main/handlers/storage.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    handleMock.mockClear();
  });

  it('registers handlers without throwing', async () => {
    const { registerStorageHandlers } = await import('./storage');

    expect(() => registerStorageHandlers()).not.toThrow();
  });

  it('registers SAFE_STORAGE_ENCRYPT and SAFE_STORAGE_DECRYPT handlers', async () => {
    const { registerStorageHandlers } = await import('./storage');

    registerStorageHandlers();

    const registeredHandlers = handleMock.mock.calls.map(
      (call: [string]) => call[0],
    );

    expect(registeredHandlers).toContain('atlassify:safe-storage-encrypt');
    expect(registeredHandlers).toContain('atlassify:safe-storage-decrypt');
  });
});
