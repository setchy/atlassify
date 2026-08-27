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
async function mapAtlassianNotificationToAtlassifyNotification(
  raw: AtlassianNotificationFragment,
  account: Account,
): Promise<AtlassifyNotification> {
  const path = raw.headNotification.content.path?.[0];
  const entity = raw.headNotification.content.entity;

  const headNotification = raw.headNotification;

  const notificationPath: AtlassifyNotificationPath | null = path
    ? {
        title: path.title,
        url: path.url as Link,
        iconUrl: path.iconUrl as Link,
      }
    : null;

  return {
    id: headNotification.notificationId,
    message: headNotification.content.message,
    readState: headNotification.readState as ReadStateType,
    updated_at: headNotification.timestamp,
    type: headNotification.content.type,
    url: headNotification.content.url as Link,
    path: notificationPath,
    entity: entity
      ? {
          title: entity.title,
          url: entity.url as Link,
          iconUrl: entity.iconUrl as Link,
        }
      : null,
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
    order: 0, // Will be set later in stabilizeNotificationsOrder
  };
}
