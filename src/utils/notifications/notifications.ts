import log from 'electron-log';
import type {
  Account,
  AccountNotifications,
  AtlassifyNotification,
  AtlassifyState,
} from '../../types';
import { getNotificationsForUser } from '../api/client';
import { determineFailureType } from '../api/errors';
import type { AtlassianNotification, Category, ReadState } from '../api/types';
import { updateTrayIcon } from '../comms';
import { Constants } from '../constants';
import { getAtlassianProduct } from '../products';
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
  return notifications?.some((n) => n.hasNextPage);
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

          return {
            account: accountNotifications.account,
            notifications: notifications,
            // TODO - there is a bug in the Atlassian GraphQL response where the relay pageInfo is not accurate
            hasNextPage:
              res.extensions.notifications.response_info.responseSize ===
              Constants.MAX_NOTIFICATIONS_PER_ACCOUNT,
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
            hasNextPage: false,
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
    // TODO Improve the fidelity of this mapping
    id: notification.headNotification.notificationId,
    title: notification.headNotification.content.message,
    readState: notification.headNotification.readState as ReadState,
    updated_at: notification.headNotification.timestamp,
    url: notification.headNotification.content.url,
    path: notification.headNotification.content.path[0],
    entity: notification.headNotification.content.entity,
    category: notification.headNotification.category as Category,
    actor: notification.headNotification.content.actor,
    product: getAtlassianProduct(notification),
    // TODO - can we avoid settings the account at the notification level?
    account: account,
  }));
}
