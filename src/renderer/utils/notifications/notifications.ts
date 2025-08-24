import { AxiosError } from 'axios';

import { logError, logWarn } from '../../../shared/logger';

import type {
  Account,
  AccountNotifications,
  AtlassifyNotification,
  AtlassifyNotificationPath,
  AtlassifyState,
  CategoryType,
  Link,
  ReadStateType,
} from '../../types';
import { getNotificationsForUser } from '../api/client';
import { determineFailureType } from '../api/errors';
import type {
  AtlassianHeadNotificationFragment,
  AtlassianNotificationFragment,
} from '../api/graphql/generated/graphql';
import type { AtlassianGraphQLResponse } from '../api/types';
import { updateTrayIcon } from '../comms';
import { Constants } from '../constants';
import { Errors } from '../errors';
import { inferAtlassianProduct } from '../products';
import { filterNotifications } from './filters';

export function setTrayIconColor(notifications: AccountNotifications[]) {
  const allNotificationsCount = getNotificationCount(notifications);

  updateTrayIcon(allNotificationsCount);
}

function getNotifications(state: AtlassifyState) {
  return state.auth.accounts.map((account) => {
    return {
      account,
      notifications: getNotificationsForUser(account, state.settings),
    };
  });
}

export function getNotificationCount(notifications: AccountNotifications[]) {
  return notifications.reduce(
    (memo, acc) => memo + acc.notifications.length,
    0,
  );
}

export function hasMoreNotifications(notifications: AccountNotifications[]) {
  return notifications?.some((n) => n.hasMoreNotifications);
}

export async function getAllNotifications(
  state: AtlassifyState,
): Promise<AccountNotifications[]> {
  const responses = await Promise.all([...getNotifications(state)]);

  const notifications: AccountNotifications[] = await Promise.all(
    responses
      .filter((response) => !!response)
      .map(async (accountNotifications) => {
        try {
          const res = await accountNotifications.notifications;

          if (res.errors) {
            throw new AxiosError(Errors.BAD_REQUEST.title);
          }

          const rawNotifications = res.data.notifications.notificationFeed
            .nodes as AtlassianNotificationFragment[];

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
          logError(
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

  return notifications;
}

async function mapAtlassianNotificationsToAtlassifyNotifications(
  account: Account,
  notifications: AtlassianNotificationFragment[],
): Promise<AtlassifyNotification[]> {
  return Promise.all(
    notifications?.map(async (notification) => {
      const headNotification =
        notification.headNotification as AtlassianHeadNotificationFragment;

      let notificationPath: AtlassifyNotificationPath;
      if (headNotification.content.path[0]) {
        notificationPath = {
          title: headNotification.content.path[0].title,
          url: headNotification.content.path[0].url as Link,
          iconUrl: headNotification.content.path[0].iconUrl as Link,
        };
      }

      return {
        id: headNotification.notificationId,
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
function determineIfMorePagesAvailable<T>(
  res: AtlassianGraphQLResponse<T>,
): boolean {
  try {
    return (
      res.extensions.notifications.response_info.responseSize ===
      Constants.MAX_NOTIFICATIONS_PER_ACCOUNT
    );
  } catch (_err) {
    logWarn(
      'determineIfMorePagesAvailable',
      'Response did not contain extensions object, assuming no more pages',
    );
  }

  return false;
}
