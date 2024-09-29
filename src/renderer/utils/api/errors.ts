import { AxiosError } from 'axios';
import type { AtlassifyError } from '../../types';
import { Errors } from '../errors';
import type { AtlassianAPIError } from './types';

export function determineFailureType(
  err: AxiosError<AtlassianAPIError>,
): AtlassifyError {
  const code = err.code;

  if (code === AxiosError.ERR_NETWORK) {
    return Errors.NETWORK;
  }

  const status = err.response?.status;

  if (
    status === 401 ||
    status === 404 ||
    err.message?.includes('safeStorage')
  ) {
    return Errors.BAD_CREDENTIALS;
  }

  return Errors.UNKNOWN;
}
