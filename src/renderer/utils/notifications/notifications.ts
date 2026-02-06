import { AxiosError } from 'axios';

import { Constants } from '../../constants';

import type {
  Account,
  AccountNotifications,
  AtlassifyNotification,
  AtlassifyNotificationPath,
  AtlassifyState,
  CategoryType,
  Link,
  ReadStateType,
  SettingsState,
} from '../../types';
import type { AtlassianGraphQLResponse } from '../api/types';

import { getNotificationsForUser } from '../api/client';
import { determineFailureType } from '../api/errors';
import type { AtlassianNotificationFragment } from '../api/graphql/generated/graphql';
import { Errors } from '../errors';
import { rendererLogError, rendererLogWarn } from '../logger';
import { inferAtlassianProduct } from '../products';
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
  // Show all notifications if:
  // 1. Not filtering unread only, OR
  // 2. Delay notification state is enabled (keeps read notifications visible during animation)
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

/**
 * Check if a notification is a group notification.
 *
 * @param notification
 * @returns true if group notification, false otherwise
 */
export function isGroupNotification(
  notification: AtlassifyNotification,
): boolean {
  return notification.notificationGroup.size > 1;
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

async function mapAtlassianNotificationsToAtlassifyNotifications(
  account: Account,
  notifications: AtlassianNotificationFragment[],
): Promise<AtlassifyNotification[]> {
  return Promise.all(
    notifications?.map(async (notification) => {
      const path = notification.headNotification.content.path?.[0];

      const headNotification = notification.headNotification;

      let notificationPath: AtlassifyNotificationPath;
      if (path) {
        notificationPath = {
          title: path.title,
          url: path.url as Link,
          iconUrl: path.iconUrl as Link,
        };
      }

      return {
        id: headNotification.notificationId,
        order: 0, // Will be set later in stabilizeNotificationsOrder
        message: headNotification.content.message,
        readState: headNotification.readState as ReadStateType,
        updated_at: headNotification.timestamp,
        type: headNotification.content.type,
        url: headNotification.content.url as Link,
        path: notificationPath,
        entity: {
          title: headNotification.content.entity.title,
          url: headNotification.content.entity.url as Link,
          iconUrl: headNotification.content.entity.iconUrl as Link,
        },
        category: headNotification.category as CategoryType,
        actor: {
          displayName: headNotification.content.actor.displayName,
          avatarURL: headNotification.content.actor.avatarURL as Link,
        },
        product: await inferAtlassianProduct(account, headNotification),
        account: account,
        notificationGroup: {
          id: notification.groupId,
          size: notification.groupSize,
          additionalActors: notification.additionalActors.map((actor) => ({
            displayName: actor.displayName,
            avatarURL: actor.avatarURL as Link,
          })),
        },
      };
    }),
  );
}

/**
 * Atlassian GraphQL response always returns true for Relay PageInfo `hasNextPage` even when there are no more pages.
 * Instead we can check the extensions response size to determine if there are more notifications.
 */
function determineIfMorePagesAvailable<TResult>(
  res: AtlassianGraphQLResponse<TResult>,
): boolean {
  try {
    return (
      res.extensions.notifications.response_info.responseSize ===
      Constants.MAX_NOTIFICATIONS_PER_ACCOUNT
    );
  } catch (_err) {
    rendererLogWarn(
      'determineIfMorePagesAvailable',
      'Response did not contain extensions object, assuming no more pages',
    );
  }

  return false;
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
