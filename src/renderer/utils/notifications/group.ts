import type {
  Account,
  AtlassifyNotification,
  SettingsState,
} from '../../types';

import { getNotificationsByGroupId } from '../api/client';
import type { GroupNotificationDetailsFragment } from '../api/graphql/generated/graphql';
import { rendererLogError } from '../logger';

/**
 * Check if a notification is a group notification.
 */
export function isGroupNotification(
  notification: AtlassifyNotification,
): boolean {
  return notification.notificationGroup.size > 1;
}

/**
 * Get all notification IDs including grouped notifications.
 * For group notifications, fetches all IDs from the group.
 */
export async function getNotificationIds(
  account: Account,
  settings: SettingsState,
  notifications: AtlassifyNotification[],
): Promise<string[]> {
  const singleGroupNotifications = notifications.filter(
    (notification) => !isGroupNotification(notification),
  );
  const singleNotificationIDs = singleGroupNotifications.map((n) => n.id);

  const groupNotifications = notifications.filter((notification) =>
    isGroupNotification(notification),
  );

  const groupNotificationIDs: string[] = [];

  for (const group of groupNotifications) {
    try {
      const res = await getNotificationsByGroupId(
        account,
        settings,
        group.notificationGroup.id,
        group.notificationGroup.size,
      );

      const groupNotificationsList = res.data.notifications.notificationGroup
        .nodes as GroupNotificationDetailsFragment[];

      const ids = groupNotificationsList.map((n) => n.notificationId);
      groupNotificationIDs.push(...ids);
    } catch (err) {
      rendererLogError(
        'getNotificationIds',
        'Error occurred while fetching notification ids for notification groups',
        err,
      );
    }
  }

  return [...singleNotificationIDs, ...groupNotificationIDs];
}

/**
 * Group notifications by product type preserving first-seen product order.
 * Returns a Map where keys are product types and values are arrays of notifications.
 * Skips notifications without valid repository data.
 */
export function groupNotificationsByProduct(
  notifications: AtlassifyNotification[],
): Map<string, AtlassifyNotification[]> {
  const productGroups = new Map<string, AtlassifyNotification[]>();

  for (const notification of notifications) {
    const product = notification.product.type;

    if (!product) {
      continue;
    }

    const group = productGroups.get(product);

    if (group) {
      group.push(notification);
    } else {
      productGroups.set(product, [notification]);
    }
  }

  return productGroups;
}

/**
 * Returns a flattened, ordered notifications list according to:
 *   - product-first-seen order (when grouped by product)
 *   - natural notification order otherwise
 */
export function getFlattenedNotificationsByProduct(
  notifications: AtlassifyNotification[],
  settings: SettingsState,
): AtlassifyNotification[] {
  if (
    settings.groupNotificationsByProduct ||
    settings.groupNotificationsByProductAlphabetically
  ) {
    const productGroups = groupNotificationsByProduct(notifications);

    return Array.from(productGroups.values()).flat();
  }

  return notifications;
}
