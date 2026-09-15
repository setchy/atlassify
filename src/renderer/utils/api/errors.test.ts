import { AxiosError, type AxiosResponse } from 'axios';

import { EVENTS } from '../../../shared/events';

import { useRuntimeStore } from '../../stores';

import type { AtlassianAPIError } from './types';

import { Errors } from '../core/errors';
import { determineFailureType } from './errors';

describe('renderer/utils/api/errors.ts', () => {
  beforeEach(() => {
    // Reset online status between tests to prevent state leak
    useRuntimeStore.getState().updateIsOnline(true);
  });

  describe('bad credentials errors', () => {
    it('bad credentials - 401', async () => {
      const result = determineFailureType(createAxiosError(401));

      expect(result).toBe(Errors.BAD_CREDENTIALS);
    });

    it('bad credentials - 404', async () => {
      const result = determineFailureType(createAxiosError(404));

      expect(result).toBe(Errors.BAD_CREDENTIALS);
    });

    it('bad credentials - safe storage', async () => {
      const result = determineFailureType(
        new Error(
          `Error invoking remote method '${EVENTS.SAFE_STORAGE_DECRYPT}': Error: Error while decrypting the ciphertext provided to safeStorage.decryptString. Ciphertext does not appear to be encrypted.`,
        ),
      );

      expect(result).toBe(Errors.BAD_CREDENTIALS);
    });
  });

  it('bad request error', async () => {
    const result = determineFailureType(new Error(Errors.BAD_REQUEST.title));

    expect(result).toBe(Errors.BAD_REQUEST);
  });

  it('network error', async () => {
    const result = determineFailureType(
      new AxiosError('Network failure', AxiosError.ERR_NETWORK),
    );

    expect(result).toBe(Errors.NETWORK);
  });

  it('offline error', async () => {
    useRuntimeStore.getState().updateIsOnline(false);
    const result = determineFailureType(
      new AxiosError('Network failure', AxiosError.ERR_NETWORK),
    );

    expect(result).toBe(Errors.OFFLINE);
  });

  it('generic error', async () => {
    const result = determineFailureType(new Error('anything'));

    expect(result).toBe(Errors.UNKNOWN);
  });
});

function createAxiosError(status: number): AxiosError<AtlassianAPIError> {
  return new AxiosError(
    'Bad credentials',
    AxiosError.ERR_BAD_REQUEST,
    undefined,
    undefined,
    createMockResponse(status, 'Bad credentials'),
  );
}

function createMockResponse(
  status: number,
  message: string,
): AxiosResponse<AtlassianAPIError> {
  return {
    data: {
      code: status,
      message,
    },
    status,
    statusText: 'Some status text',
    headers: {},
    config: {
      headers: undefined,
    },
  };
}
