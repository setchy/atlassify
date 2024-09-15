import { AxiosError, type AxiosResponse } from 'axios';
import { Errors } from '../errors';
import { determineFailureType } from './errors';
import type { AtlassianAPIError } from './types';

describe('utils/api/errors.ts', () => {
  it('network error', async () => {
    const mockError: Partial<AxiosError<AtlassianAPIError>> = {
      code: AxiosError.ERR_NETWORK,
    };

    const result = determineFailureType(
      mockError as AxiosError<AtlassianAPIError>,
    );

    expect(result).toBe(Errors.NETWORK);
  });

  describe('bad request errors', () => {
    it('bad credentials', async () => {
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

    it('unhandled bad request error', async () => {
      const mockError: Partial<AxiosError<AtlassianAPIError>> = {
        code: AxiosError.ERR_BAD_REQUEST,
        status: 400,
        response: createMockResponse(403, 'Oops! Something went wrong.'),
      };

      const result = determineFailureType(
        mockError as AxiosError<AtlassianAPIError>,
      );

      expect(result).toBe(Errors.UNKNOWN);
    });
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
