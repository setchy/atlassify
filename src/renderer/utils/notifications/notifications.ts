import { AxiosError } from 'axios';

import type { Account, AccountNotifications } from '../../types';

import { getNotificationsForUser } from '../api/client';
import { determineFailureType } from '../api/errors';
import { transformNotifications } from '../api/transform';
import { determineIfMorePagesAvailable } from '../api/utils';
import { Errors } from '../errors';
import { rendererLogError } from '../logger';
import { getFlattenedNotificationsByProduct } from './group';

/**
 * Get the count of notifications across all accounts.
 *
 * @param notifications - The account notifications to check.
 * @returns The count of all notifications.
 */
export function getNotificationCount(
  accountNotifications: AccountNotifications[],
) {
  return accountNotifications.reduce(
    (memo, account) => memo + account.notifications.length,
    0,
  );
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

function getNotifications(accounts: Account[]) {
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
 * @param auth - The accounts state.
 * @returns A promise that resolves to an array of account notifications.
 */
export async function getAllNotifications(
  accounts: Account[],
): Promise<AccountNotifications[]> {
  const accountNotifications: AccountNotifications[] = await Promise.all(
    getNotifications(accounts)
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
 * during notification interaction events (mark as read, mark as done, etc.)
 *
 * @param accountNotifications
 */
export function stabilizeNotificationsOrder(
  accountNotifications: AccountNotifications[],
) {
  let orderIndex = 0;

  for (const account of accountNotifications) {
    const flattenedNotifications = getFlattenedNotificationsByProduct(
      account.notifications,
    );

    for (const notification of flattenedNotifications) {
      notification.order = orderIndex++;
    }
  }
}
