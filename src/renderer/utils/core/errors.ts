import { Constants } from '../../constants';

import type {
  AccountNotifications,
  AtlassifyError,
  ErrorType,
} from '../../types';

import i18n from '../../i18n';

/**
 * Error catalog.
 *
 * Translated strings are exposed as getters so they resolve in the *current*
 * language whenever they are read, rather than being frozen at module load.
 * The entries themselves are stable object references, so callers may rely on
 * reference equality (e.g. `areAllAccountErrorsSame`, `determineFailureType`).
 */
export const Errors: Record<ErrorType, AtlassifyError> = {
  BAD_CREDENTIALS: {
    get title() {
      return i18n.t('errors.badCredentials.title', {
        defaultValue: 'Bad Credentials',
      });
    },
    get descriptions() {
      return [
        i18n.t('errors.badCredentials.description1', {
          defaultValue: 'Your credentials are either invalid or expired.',
        }),
        i18n.t('errors.badCredentials.description2', {
          defaultValue:
            'Please try removing your account and authenticating again.',
        }),
      ];
    },
    emojis: Constants.EMOJIS.ERRORS.BAD_CREDENTIALS,
    actions: [
      {
        get label() {
          return i18n.t('accounts.manage', { defaultValue: 'Manage accounts' });
        },
        route: '/accounts',
        appearance: 'warning',
      },
    ],
  },
  BAD_REQUEST: {
    get title() {
      return i18n.t('errors.badRequest.title', { defaultValue: 'Bad Request' });
    },
    get descriptions() {
      return [
        i18n.t('errors.badRequest.description1', {
          defaultValue: 'Something went wrong making the API request.',
        }),
      ];
    },
    emojis: Constants.EMOJIS.ERRORS.BAD_REQUEST,
  },
  NETWORK: {
    get title() {
      return i18n.t('errors.network.title', { defaultValue: 'Network Error' });
    },
    get descriptions() {
      return [
        i18n.t('errors.network.description1', {
          defaultValue: 'Unable to connect to Atlassian Cloud.',
        }),
        i18n.t('errors.network.description2', {
          defaultValue:
            'Please check your network connection, including whether you require a VPN, and try again.',
        }),
      ];
    },
    emojis: Constants.EMOJIS.ERRORS.NETWORK,
  },
  OFFLINE: {
    get title() {
      return i18n.t('errors.offline.title', {
        defaultValue: 'Network Offline',
      });
    },
    get descriptions() {
      return [
        i18n.t('errors.offline.description1', {
          defaultValue: 'Your device is offline.',
        }),
        i18n.t('errors.offline.description2', {
          defaultValue: 'Please check your network connection.',
        }),
      ];
    },
    emojis: Constants.EMOJIS.ERRORS.OFFLINE,
  },
  UNKNOWN: {
    get title() {
      return i18n.t('errors.unknown.title', {
        defaultValue: 'Oops! Something went wrong',
      });
    },
    get descriptions() {
      return [
        i18n.t('errors.unknown.description1', {
          defaultValue: 'Please try again later.',
        }),
      ];
    },
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
