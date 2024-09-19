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

  if (code !== AxiosError.ERR_BAD_REQUEST) {
    return Errors.UNKNOWN;
  }

  const status = err.response.status;

  if (status === 401) {
    return Errors.BAD_CREDENTIALS;
  }

  if (status === 404) {
    return Errors.BAD_CREDENTIALS;
  }

  return Errors.UNKNOWN;
}
