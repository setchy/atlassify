import { useSettingsStore } from '../../stores';

import type { Account, AtlassifyNotification } from '../../types';

import { getNotificationsByGroupId } from '../api/client';
import type { GroupNotificationDetailsFragment } from '../api/graphql/generated/graphql';
import { rendererLogError } from '../core/logger';
import { GROUPING_CONFIGS } from './grouping';
import { groupNotifications } from './grouping/utils';

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
 * Returns a flattened, ordered notifications list according to:
 *   - grouped order (when grouping is enabled)
 *   - natural notification order otherwise
 *
 * @param notifications List of notifications to flatten
 * @returns Flattened list of notifications
 */
export function flattenGroupedNotifications(
  notifications: AtlassifyNotification[],
): AtlassifyNotification[] {
  const { groupBy } = useSettingsStore.getState();

  if (groupBy === 'none') {
    return notifications;
  }

  const config = GROUPING_CONFIGS[groupBy];
  const groups = groupNotifications(notifications, config.getGroupKey);

  return Array.from(groups.values()).flat();
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
