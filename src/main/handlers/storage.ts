import { safeStorage } from 'electron';

import { EVENTS } from '../../shared/events';
import { logError } from '../../shared/logger';

import { handleMainEvent } from '../events';

export function registerStorageHandlers(): void {
  handleMainEvent(EVENTS.SAFE_STORAGE_ENCRYPT, (_, value: string) => {
    return safeStorage.encryptString(value).toString('base64');
  });

  handleMainEvent(EVENTS.SAFE_STORAGE_DECRYPT, (_, value: string) => {
    try {
      return safeStorage.decryptString(Buffer.from(value, 'base64'));
    } catch (err) {
      logError(
        'main:safe-storage-decrypt',
        'Failed to decrypt value - data may be from old build',
        err,
      );
      throw err;
    }
  });
}
