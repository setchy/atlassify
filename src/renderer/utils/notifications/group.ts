import type {
  AccountNotifications,
  AtlassifyNotification,
  SettingsState,
} from '../../types';

/**
 * Group notifications by product type preserving first-seen repo order.
 * Returns a Map where keys are product types and values are arrays of notifications.
 */
export function groupNotificationsByProduct(
  accounts: AccountNotifications[],
): Map<string, AtlassifyNotification[]> {
  const productGroups = new Map<string, AtlassifyNotification[]>();

  for (const account of accounts) {
    for (const notification of account.notifications) {
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
  }

  return productGroups;
}

/**
 * Returns a flattened, ordered notifications list according to:
 *   - product-first-seen order (when grouped)
 *   - alphabetic product order; or
 *   - the natural account->notification order otherwise.
 */
export function getFlattenedNotificationsByProduct(
  accounts: AccountNotifications[],
  settings: SettingsState,
): AtlassifyNotification[] {
  if (
    settings.groupNotificationsByProduct ||
    settings.groupNotificationsByProductAlphabetically
  ) {
    const productGroups = groupNotificationsByProduct(accounts);

    return Array.from(productGroups.values()).flat();
  }

  return accounts.flatMap((a) => a.notifications);
}
