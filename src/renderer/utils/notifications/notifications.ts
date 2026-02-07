import { AxiosError } from 'axios';

import type {
  AccountNotifications,
  AtlassifyNotification,
  AtlassifyState,
  SettingsState,
} from '../../types';

import { getNotificationsForUser } from '../api/client';
import { determineFailureType } from '../api/errors';
import { mapAtlassianNotificationsToAtlassifyNotifications } from '../api/transform';
import { determineIfMorePagesAvailable } from '../api/utils';
import { Errors } from '../errors';
import { rendererLogError } from '../logger';
import { filterNotifications } from './filters';
import { getFlattenedNotificationsByProduct } from './group';

/**
 * Filter notifications based on read state settings.
 *
 * @param notifications - The notifications to filter.
 * @param settings - The user settings.
 * @returns Filtered notifications based on settings.
 */
export function filterVisibleNotifications(
  notifications: AtlassifyNotification[],
  settings: SettingsState,
): AtlassifyNotification[] {
  if (
    !settings.fetchOnlyUnreadNotifications ||
    settings.delayNotificationState
  ) {
    return notifications;
  }

  // Only hide read notifications if both conditions are met
  return notifications.filter((n) => n.readState === 'unread');
}

/**
 * Check if any accounts have more notifications beyond the max page size fetched per account.
 *
 * @param notifications - The account notifications to check.
 * @returns The count of all notifications.
 */
export function hasMoreNotifications(
  accountNotifications: AccountNotifications[],
) {
  return accountNotifications?.some((account) => account.hasMoreNotifications);
}

function getNotifications(state: AtlassifyState) {
  return state.auth.accounts.map((account) => {
    return {
      account,
      notifications: getNotificationsForUser(account, state.settings),
    };
  });
}

/**
 * Get all notifications for all accounts.
 *
 * @param state - The Gitify state.
 * @returns A promise that resolves to an array of account notifications.
 */
export async function getAllNotifications(
  state: AtlassifyState,
): Promise<AccountNotifications[]> {
  const accountNotifications: AccountNotifications[] = await Promise.all(
    getNotifications(state)
      .filter((response) => !!response)
      .map(async (accountNotifications) => {
        try {
          const res = await accountNotifications.notifications;

          if (res.errors) {
            throw new AxiosError(Errors.BAD_REQUEST.title);
          }

          const rawNotifications =
            res.data.notifications.notificationFeed.nodes;

          let notifications =
            await mapAtlassianNotificationsToAtlassifyNotifications(
              accountNotifications.account,
              rawNotifications,
            );

          notifications = filterNotifications(notifications, state.settings);

          return {
            account: accountNotifications.account,
            notifications: notifications,
            hasMoreNotifications: determineIfMorePagesAvailable(res),
            error: null,
          };
        } catch (err) {
          rendererLogError(
            'getAllNotifications',
            'error occurred while fetching account notifications',
            err,
          );

          return {
            account: accountNotifications.account,
            notifications: [],
            hasMoreNotifications: false,
            error: determineFailureType(err),
          };
        }
      }),
  );

  // Set the order property for the notifications
  stabilizeNotificationsOrder(accountNotifications, state.settings);

  return accountNotifications;
}

/**
 * Assign an order property to each notification to stabilize how they are displayed
 * during notification interaction events (mark as read, mark as done, etc.)
 *
 * @param accountNotifications
 * @param settings
 */
export function stabilizeNotificationsOrder(
  accountNotifications: AccountNotifications[],
  settings: SettingsState,
) {
  let orderIndex = 0;

  for (const account of accountNotifications) {
    const flattenedNotifications = getFlattenedNotificationsByProduct(
      account.notifications,
      settings,
    );

    for (const notification of flattenedNotifications) {
      notification.order = orderIndex++;
    }
  }
}
