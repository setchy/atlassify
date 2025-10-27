import { EVENTS } from '../../../shared/events';

import { Errors } from '../errors';
import { determineFailureType } from './errors';
import type { AtlassianAPIError } from './types';

describe('renderer/utils/api/errors.ts', () => {
  describe('bad credentials errors', () => {
    it('bad credentials - 401', async () => {
      const mockError = {
        code: 'ERR_BAD_REQUEST',
        response: createMockResponse(401, 'Bad credentials'),
      };

      const result = determineFailureType(mockError);

      expect(result).toBe(Errors.BAD_CREDENTIALS);
    });

    it('bad credentials - 404', async () => {
      const mockError = {
        code: 'ERR_BAD_REQUEST',
        response: createMockResponse(404, 'Bad credentials'),
      };

      const result = determineFailureType(mockError);

      expect(result).toBe(Errors.BAD_CREDENTIALS);
    });

    it('bad credentials - safe storage', async () => {
      const mockError = {
        code: 'ERR_BAD_REQUEST',
        message: `Error invoking remote method '${EVENTS.SAFE_STORAGE_DECRYPT}': Error: Error while decrypting the ciphertext provided to safeStorage.decryptString. Ciphertext does not appear to be encrypted.`,
      };

      const result = determineFailureType(mockError);

      expect(result).toBe(Errors.BAD_CREDENTIALS);
    });
  });

  it('bad request error', async () => {
    const mockError = {
      message: Errors.BAD_REQUEST.title,
    };

    const result = determineFailureType(mockError);

    expect(result).toBe(Errors.BAD_REQUEST);
  });

  it('network error', async () => {
    const mockError = {
      code: 'ERR_NETWORK',
    } as const;

    const result = determineFailureType(mockError);

    expect(result).toBe(Errors.NETWORK);
  });

  it('unknown error', async () => {
    const mockError = {
      code: 'anything',
    };

    const result = determineFailureType(mockError);

    expect(result).toBe(Errors.UNKNOWN);
  });
});

function createMockResponse(status: number, message: string) {
  return {
    status,
    data: {
      code: status,
      message,
    } as AtlassianAPIError,
  } as const;
}
