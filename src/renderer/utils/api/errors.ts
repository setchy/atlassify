import { AxiosError } from 'axios';

import type { AccountNotifications, AtlassifyError } from '../../types';
import { Errors } from '../errors';
import type { AtlassianAPIError } from './types';

export function determineFailureType(
  err: AxiosError<AtlassianAPIError>,
): AtlassifyError {
  if (err.message === Errors.BAD_REQUEST.title) {
    return Errors.BAD_REQUEST;
  }

  if (err.code === AxiosError.ERR_NETWORK) {
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

/**
 * Check if all accounts have errors
 */
export function doesAllAccountsHaveErrors(
  notifications: AccountNotifications[],
) {
  return (
    notifications.length > 0 &&
    notifications.every((account) => account.error !== null)
  );
}

/**
 * Check if all account errors are the same
 */
export function areAllAccountErrorsSame(notifications: AccountNotifications[]) {
  if (notifications.length === 0) {
    return true;
  }

  const firstError = notifications[0].error;
  return notifications.every((account) => account.error === firstError);
}
