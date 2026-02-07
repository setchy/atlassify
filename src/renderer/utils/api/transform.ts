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
 * Transform raw Atlassian notifications to Atlassify notifications.
 *
 * This is the ONLY place where raw Atlassian types should be converted
 * to Atlassify's internal notification type.
 *
 * @param account - The account.
 * @param notifications - The Atlassian notifications.
 * @returns A promise that resolves to an array of Atlassify notifications.
 */
export async function mapAtlassianNotificationsToAtlassifyNotifications(
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
