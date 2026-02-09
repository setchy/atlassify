import type { AtlassifyNotification } from '../../types';
import type { SettingsState } from '../../stores/types';

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
