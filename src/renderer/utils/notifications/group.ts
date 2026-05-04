import { useSettingsStore } from '../../stores';

import type { Account, AtlassifyNotification } from '../../types';

import { getNotificationsByGroupId } from '../api/client';
import type { GroupNotificationDetailsFragment } from '../api/graphql/generated/graphql';
import { rendererLogError } from '../core/logger';

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
 * Skips notifications without a product type.
 *
 * @param notifications - List of notifications to group.
 * @returns Map of product types to arrays of notifications.
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
 * Sort notifications by their stabilized display order.
 *
 * @param notifications - List of notifications to sort.
 * @returns A new sorted array of notifications.
 */
export function sortNotificationsByOrder(
  notifications: AtlassifyNotification[],
): AtlassifyNotification[] {
  return [...notifications].sort((a, b) => a.order - b.order);
}

/**
 * Converts grouped notifications into an ordered entries array, optionally sorted alphabetically.
 *
 * @param notifications - Ordered list of notifications to group.
 * @param alphabetically - Whether to sort product groups alphabetically by product type.
 * @returns Ordered entries array of [productType, notifications[]] pairs.
 */
export function groupNotificationsByProductEntries(
  notifications: AtlassifyNotification[],
  alphabetically: boolean,
): [string, AtlassifyNotification[]][] {
  const entries = Array.from(
    groupNotificationsByProduct(notifications).entries(),
  );

  if (alphabetically) {
    entries.sort((a, b) => a[0].localeCompare(b[0]));
  }

  return entries;
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
  const {
    groupNotificationsByProduct: groupByProduct,
    groupNotificationsByProductAlphabetically: groupAlphabetically,
  } = useSettingsStore.getState();

  if (groupByProduct || groupAlphabetically) {
    const productGroups = groupNotificationsByProduct(notifications);

    return Array.from(productGroups.values()).flat();
  }

  return notifications;
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
  // Separate single and group notifications

  const singleNotificationIDs = getNotificationIdsForNonGroups(notifications);

  // Resolve group notification IDs
  const groupedNotificationIds = await getNotificationIdsForGroups(
    account,
    notifications,
  );

  return [...singleNotificationIDs, ...groupedNotificationIds];
}

/**
 * Given a list of notifications, resolves all notification IDs for non-group notifications.
 *
 * @param notifications - List of notifications (may include group notifications).
 * @returns Array of notification IDs for non-group notifications.
 */
export function getNotificationIdsForNonGroups(
  notifications: AtlassifyNotification[],
): string[] {
  const singleGroupNotifications = notifications.filter(
    (notification) => !isGroupNotification(notification),
  );

  return singleGroupNotifications.map((notification) => notification.id);
}

/**
 * Given a list of notifications, resolves all notification IDs for group notifications.
 *
 * @param account - The account to use for fetching group notifications.
 * @param notifications - List of notifications (may include group notifications).
 * @returns Promise resolving to a flat array of notification IDs for all group notifications.
 */
export async function getNotificationIdsForGroups(
  account: Account,
  notifications: AtlassifyNotification[],
): Promise<string[]> {
  const notificationIDs: string[] = [];

  const groupNotifications = notifications.filter((notification) =>
    isGroupNotification(notification),
  );

  const results = await Promise.allSettled(
    groupNotifications.map(async (group) => {
      const res = await getNotificationsByGroupId(
        account,
        group.notificationGroup.id,
        group.notificationGroup.size,
      );

      const nodes = res.data.notifications.notificationGroup
        .nodes as GroupNotificationDetailsFragment[];

      return nodes.map((notification) => notification.notificationId);
    }),
  );

  for (const result of results) {
    if (result.status === 'fulfilled') {
      notificationIDs.push(...result.value);
    } else {
      rendererLogError(
        'getNotificationIdsForGroups',
        'Error occurred while fetching notification ids for notification groups',
        result.reason,
      );
    }
  }

  return notificationIDs;
}
