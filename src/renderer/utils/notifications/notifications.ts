import log from 'electron-log';
import type {
  Account,
  AccountNotifications,
  AtlassifyNotification,
  AtlassifyState,
} from '../../types';
import { getNotificationsForUser } from '../api/client';
import { determineFailureType } from '../api/errors';
import type { AtlassianNotification } from '../api/types';
import { updateTrayIcon } from '../comms';
import { Constants } from '../constants';
import { getAtlassianProduct } from '../products';
import { filterNotifications } from './filter';

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
          const res = (await accountNotifications.notifications).data;

          const rawNotifications =
            res.data.notifications.notificationFeed.nodes;

          let notifications = mapAtlassianNotificationsToAtlassifyNotifications(
            accountNotifications.account,
            rawNotifications,
          );

          notifications = filterNotifications(notifications, state.settings);

          let hasMorePages = false;
          try {
            // TODO there is a bug in the Atlassian GraphQL response where the relay pageInfo is not accurate
            hasMorePages =
              res.extensions.notifications.response_info.responseSize ===
              Constants.MAX_NOTIFICATIONS_PER_ACCOUNT;
          } catch (error) {
            log.warn(
              'Response did not contain extensions object, assuming no more pages',
              error,
            );
          }

          return {
            account: accountNotifications.account,
            notifications: notifications,
            hasMoreNotifications: hasMorePages,
            error: null,
          };
        } catch (error) {
          log.error(
            'Error occurred while fetching account notifications',
            error,
          );
          return {
            account: accountNotifications.account,
            notifications: [],
            hasMoreNotifications: false,
            error: determineFailureType(error),
          };
        }
      }),
  );

  return notifications;
}

function mapAtlassianNotificationsToAtlassifyNotifications(
  account: Account,
  notifications: AtlassianNotification[],
): AtlassifyNotification[] {
  return notifications?.map((notification: AtlassianNotification) => ({
    id: notification.headNotification.notificationId,
    message: notification.headNotification.content.message,
    readState: notification.headNotification.readState,
    updated_at: notification.headNotification.timestamp,
    type: notification.headNotification.content.type,
    url: notification.headNotification.content.url,
    path: notification.headNotification.content.path[0],
    entity: notification.headNotification.content.entity,
    category: notification.headNotification.category,
    actor: notification.headNotification.content.actor,
    product: getAtlassianProduct(notification),
    account: account,
  }));
}
