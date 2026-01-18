import { AxiosError, type AxiosResponse } from 'axios';

import { EVENTS } from '../../../shared/events';

import type { AtlassianAPIError } from './types';

import { Errors } from '../errors';
import { determineFailureType } from './errors';

describe('renderer/utils/api/errors.ts', () => {
  describe('bad credentials errors', () => {
    it('bad credentials - 401', async () => {
      const mockError: Partial<AxiosError<AtlassianAPIError>> = {
        code: AxiosError.ERR_BAD_REQUEST,
        status: 401,
        response: createMockResponse(401, 'Bad credentials'),
      };

      const result = determineFailureType(
        mockError as AxiosError<AtlassianAPIError>,
      );

      expect(result).toBe(Errors.BAD_CREDENTIALS);
    });

    it('bad credentials - 404', async () => {
      const mockError: Partial<AxiosError<AtlassianAPIError>> = {
        code: AxiosError.ERR_BAD_REQUEST,
        status: 404,
        response: createMockResponse(404, 'Bad credentials'),
      };

      const result = determineFailureType(
        mockError as AxiosError<AtlassianAPIError>,
      );

      expect(result).toBe(Errors.BAD_CREDENTIALS);
    });

    it('bad credentials - safe storage', async () => {
      const mockError: Partial<AxiosError<AtlassianAPIError>> = {
        code: AxiosError.ERR_BAD_REQUEST,
        status: 404,
        message: `Error invoking remote method '${EVENTS.SAFE_STORAGE_DECRYPT}': Error: Error while decrypting the ciphertext provided to safeStorage.decryptString. Ciphertext does not appear to be encrypted.`,
      };

      const result = determineFailureType(
        mockError as AxiosError<AtlassianAPIError>,
      );

      expect(result).toBe(Errors.BAD_CREDENTIALS);
    });
  });

  it('bad request error', async () => {
    const mockError: Partial<AxiosError<AtlassianAPIError>> = {
      message: Errors.BAD_REQUEST.title,
    };

    const result = determineFailureType(
      mockError as AxiosError<AtlassianAPIError>,
    );

    expect(result).toBe(Errors.BAD_REQUEST);
  });

  it('network error', async () => {
    const mockError: Partial<AxiosError<AtlassianAPIError>> = {
      code: AxiosError.ERR_NETWORK,
    };

    const result = determineFailureType(
      mockError as AxiosError<AtlassianAPIError>,
    );

    expect(result).toBe(Errors.NETWORK);
  });

  it('unknown error', async () => {
    const mockError: Partial<AxiosError<AtlassianAPIError>> = {
      code: 'anything',
    };

    const result = determineFailureType(
      mockError as AxiosError<AtlassianAPIError>,
    );

    expect(result).toBe(Errors.UNKNOWN);
  });
});

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
