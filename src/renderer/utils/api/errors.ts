import type { AtlassifyError } from '../../types';
import { Errors } from '../errors';

type HttpError = {
  message?: string;
  code?: string;
  response?: { status?: number };
};

export function determineFailureType(err: HttpError): AtlassifyError {
  if (err.message === Errors.BAD_REQUEST.title) {
    return Errors.BAD_REQUEST;
  }

  if (err.code === 'ERR_NETWORK') {
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
