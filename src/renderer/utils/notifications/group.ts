import { useSettingsStore } from '../../stores';

import type { Account, AtlassifyNotification } from '../../types';

import { getNotificationsByGroupId } from '../api/client';
import type { GroupNotificationDetailsFragment } from '../api/graphql/generated/graphql';
import { rendererLogError } from '../logger';

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

/**
 * Group notifications by product type preserving first-seen product order.
 * Returns a Map where keys are product types and values are arrays of notifications.
 * Skips notifications without valid repository data.
 *
 * @param notifications List of notifications to group
 * @returns Map of product types to arrays of notifications
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
 *
 * @param notifications List of notifications to flatten
 * @returns Flattened list of notifications
 */
export function getFlattenedNotificationsByProduct(
  notifications: AtlassifyNotification[],
): AtlassifyNotification[] {
  const settings = useSettingsStore.getState();

  if (
    settings.groupNotificationsByProduct ||
    settings.groupNotificationsByProductAlphabetically
  ) {
    const productGroups = groupNotificationsByProduct(notifications);

    return Array.from(productGroups.values()).flat();
  }

  return notifications;
}

/**
 * Given a list of notifications, resolves all notification IDs for group notifications.
 *
 * @param account The account to use for fetching group notifications
 * @param notifications List of notifications (may include group notifications)
 */
export async function getNotificationIdsForGroups(
  account: Account,
  notifications: AtlassifyNotification[],
): Promise<string[]> {
  const notificationIDs: string[] = [];

  const groupNotifications = notifications.filter((notification) =>
    isGroupNotification(notification),
  );

  try {
    for (const group of groupNotifications) {
      const res = await getNotificationsByGroupId(
        account,
        group.notificationGroup.id,
        group.notificationGroup.size,
      );

      const groupNotifications = res.data.notifications.notificationGroup
        .nodes as GroupNotificationDetailsFragment[];

      const groupNotificationIDs = groupNotifications.map(
        (notification) => notification.notificationId,
      );

      notificationIDs.push(...groupNotificationIDs);
    }
  } catch (err) {
    rendererLogError(
      'getNotificationIdsForGroups',
      'Error occurred while fetching notification ids for notification groups',
      err,
    );
  }

  return notificationIDs;
}

/**
 * Resolves all notification IDs for a given list of notifications, including both single and grouped notifications.
 *
 * @param account The account to use for fetching group notifications
 * @param notifications List of notifications (may include group notifications)
 * @returns Promise resolving to a flat array of notification IDs
 */
export async function resolveNotificationIdsForGroup(
  account: Account,
  notifications: AtlassifyNotification[],
): Promise<string[]> {
  const singleGroupNotifications = notifications.filter(
    (notification) => !isGroupNotification(notification),
  );

  const singleNotificationIDs = singleGroupNotifications.map(
    (notification) => notification.id,
  );

  const groupedNotificationIds = await getNotificationIdsForGroups(
    account,
    notifications,
  );

  return [...singleNotificationIDs, ...groupedNotificationIds];
}
