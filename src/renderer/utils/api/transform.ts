import type {
  Account,
  AtlassifyNotification,
  AtlassifyNotificationPath,
  CategoryType,
  Link,
  ReadStateType,
} from '../../types';

import { inferAtlassianProduct } from '../products';
import type { AtlassianNotificationFragment } from './graphql/generated/graphql';

/**
 * Transform all raw notifications from Atlassian types to Atlassify types.
 *
 * @param rawNotifications - The Atlassian notifications.
 * @param account - The account.
 * @returns Transformed Atlassify notifications.
 */
export async function transformNotifications(
  rawNotifications: AtlassianNotificationFragment[],
  account: Account,
): Promise<AtlassifyNotification[]> {
  return Promise.all(
    rawNotifications?.map((raw) =>
      mapAtlassianNotificationToAtlassifyNotification(raw, account),
    ),
  );
}

/**
 * Transform a raw Atlassian notification into an Atlassify notification.
 * Called immediately after GraphQL API response is received.
 *
 * This is the ONLY place where raw Atlassian types should be converted
 * to Atlassify's internal notification type.
 *
 * @param raw - The Atlassian notification.
 * @param account - The account.
 * @returns A transformed Atlassify notification.
 */
export async function mapAtlassianNotificationToAtlassifyNotification(
  raw: AtlassianNotificationFragment,
  account: Account,
): Promise<AtlassifyNotification> {
  const path = raw.headNotification.content.path?.[0];

  const headNotification = raw.headNotification;

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
    notificationGroup: {
      id: raw.groupId,
      size: raw.groupSize,
      additionalActors: raw.additionalActors.map((actor) => ({
        displayName: actor.displayName,
        avatarURL: actor.avatarURL as Link,
      })),
    },
    account: account,
    // Order will be set later in stabilizeNotificationsOrder
    order: 0,
  };
}
