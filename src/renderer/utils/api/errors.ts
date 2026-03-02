import { AxiosError } from 'axios';

import { useRuntimeStore } from '../../stores';

import type { AtlassifyError } from '../../types';
import type { AtlassianAPIError } from './types';

import { Errors } from '../errors';

export function determineFailureType(
  err: AxiosError<AtlassianAPIError>,
): AtlassifyError {
  const { isOnline } = useRuntimeStore.getState();
  if (!isOnline) {
    return Errors.OFFLINE;
  }

  if (err.code === AxiosError.ERR_NETWORK) {
    return Errors.NETWORK;
  }

  if (err.message === Errors.BAD_REQUEST.title) {
    return Errors.BAD_REQUEST;
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
