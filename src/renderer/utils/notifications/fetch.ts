import { AxiosError } from 'axios';

import { useAccountsStore } from '../../stores';

import type { AccountNotifications, AtlassifyNotification } from '../../types';

import { getNotificationsForUser } from '../api/client';
import { determineFailureType } from '../api/errors';
import { determineIfMorePagesAvailable } from '../api/pagination';
import { transformNotifications } from '../api/transform';
import { Errors } from '../core/errors';
import { rendererLogError } from '../core/logger';
import { flattenGroupedNotifications } from './group';

/**
 * Get the count of notifications across all accounts.
 *
 * @param accountNotifications - The account notifications to check.
 * @returns The total count of all notifications across all accounts.
 */
export function getNotificationCount(
  accountNotifications: AccountNotifications[],
) {
  return accountNotifications.reduce(
    (sum, account) => sum + account.notifications.length,
    0,
  );
}

/**
 * Check if any accounts have more notifications beyond the max page size fetched per account.
 *
 * @param accountNotifications - The account notifications to check.
 * @returns `true` if any account has more notifications available to load, `false` otherwise.
 */
export function hasMoreNotifications(
  accountNotifications: AccountNotifications[],
) {
  return accountNotifications?.some((account) => account.hasMoreNotifications);
}

function getNotifications() {
  const accounts = useAccountsStore.getState().accounts;
  return accounts.map((account) => {
    return {
      account,
      notifications: getNotificationsForUser(account),
    };
  });
}

/**
 * Get all notifications for all accounts.
 *
 * Notifications follow these stages:
 *  - Fetch / retrieval
 *  - Transform
 *  - Filtering
 *  - Ordering
 *
 * @returns A promise that resolves to an array of account notifications.
 */
export async function getAllNotifications(): Promise<AccountNotifications[]> {
  const accountNotifications: AccountNotifications[] = await Promise.all(
    getNotifications()
      .filter((response) => !!response)
      .map(async (accountNotifications) => {
        try {
          const res = await accountNotifications.notifications;

          if (res.errors) {
            throw new AxiosError(Errors.BAD_REQUEST.title);
          }

          const rawNotifications =
            res.data.notifications.notificationFeed.nodes;

          const notifications = await transformNotifications(
            rawNotifications,
            accountNotifications.account,
          );

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
  stabilizeNotificationsOrder(accountNotifications);

  return accountNotifications;
}

/**
 * Assign an order property to each notification to stabilize how they are displayed
 * during notification interaction events (mark as read, mark as done, etc.).
 *
 * @param accountNotifications - The list of account notifications to assign order indices to.
 */
export function stabilizeNotificationsOrder(
  accountNotifications: AccountNotifications[],
) {
  let orderIndex = 0;

  for (const account of accountNotifications) {
    const flattenedNotifications = flattenGroupedNotifications(
      account.notifications,
    );

    for (const notification of flattenedNotifications) {
      notification.order = orderIndex++;
    }
  }
}

/**
 * Find notifications that exist in newNotifications but not in previousNotifications.
 *
 * @param previousAccountNotifications - The previous state of account notifications.
 * @param newAccountNotifications - The new state of account notifications.
 * @returns Array of notifications that are new (present in new state but absent in previous state).
 */
export function getNewNotifications(
  previousAccountNotifications: AccountNotifications[],
  newAccountNotifications: AccountNotifications[],
): AtlassifyNotification[] {
  return newAccountNotifications.flatMap((accountNotifications) => {
    const accountPreviousNotifications = previousAccountNotifications.find(
      (item) => item.account.id === accountNotifications.account.id,
    );

    if (!accountPreviousNotifications) {
      return accountNotifications.notifications;
    }

    const previousIds = new Set(
      accountPreviousNotifications.notifications.map((item) => item.id),
    );

    return accountNotifications.notifications.filter(
      (notification) => !previousIds.has(notification.id),
    );
  });
}
