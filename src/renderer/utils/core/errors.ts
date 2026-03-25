import { Constants } from '../../constants';

import type {
  AccountNotifications,
  AtlassifyError,
  ErrorType,
} from '../../types';

import i18n from '../../i18n';

export const Errors: Record<ErrorType, AtlassifyError> = {
  BAD_CREDENTIALS: {
    title: i18n.t('errors.badCredentials.title'),
    descriptions: [
      i18n.t('errors.badCredentials.description1'),
      i18n.t('errors.badCredentials.description2'),
    ],
    emojis: Constants.EMOJIS.ERRORS.BAD_CREDENTIALS,
    actions: [
      {
        label: i18n.t('accounts.manage'),
        route: '/accounts',
        appearance: 'warning',
      },
    ],
  },
  BAD_REQUEST: {
    title: i18n.t('errors.badRequest.title'),
    descriptions: [i18n.t('errors.badRequest.description1')],
    emojis: Constants.EMOJIS.ERRORS.BAD_REQUEST,
  },
  NETWORK: {
    title: i18n.t('errors.network.title'),
    descriptions: [
      i18n.t('errors.network.description1'),
      i18n.t('errors.network.description2'),
    ],
    emojis: Constants.EMOJIS.ERRORS.NETWORK,
  },
  OFFLINE: {
    title: i18n.t('errors.offline.title'),
    descriptions: [
      i18n.t('errors.offline.description1'),
      i18n.t('errors.offline.description2'),
    ],
    emojis: Constants.EMOJIS.ERRORS.OFFLINE,
  },
  UNKNOWN: {
    title: i18n.t('errors.unknown.title'),
    descriptions: [i18n.t('errors.unknown.description1')],
    emojis: Constants.EMOJIS.ERRORS.UNKNOWN,
  },
};

/**
 * Check if all accounts have errors
 */
export function doesAllAccountsHaveErrors(
  accountNotifications: AccountNotifications[],
) {
  return (
    accountNotifications.length > 0 &&
    accountNotifications.every((account) => account.error !== null)
  );
}

/**
 * Check if all account errors are the same
 */
export function areAllAccountErrorsSame(
  accountNotifications: AccountNotifications[],
) {
  if (accountNotifications.length === 0) {
    return true;
  }

  const firstError = accountNotifications[0].error;
  return accountNotifications.every((account) => account.error === firstError);
}
