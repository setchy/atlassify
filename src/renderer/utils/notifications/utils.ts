import type { AccountNotifications, AtlassifyNotification } from '../../types';

/**
 * Find notifications that exist in newNotifications but not in previousNotifications
 */
export function getNewNotifications(
  previousNotifications: AccountNotifications[],
  newNotifications: AccountNotifications[],
): AtlassifyNotification[] {
  return newNotifications.flatMap((accountNotifications) => {
    const accountPreviousNotifications = previousNotifications.find(
      (item) => item.account.id === accountNotifications.account.id,
    );

    if (!accountPreviousNotifications) {
      return accountNotifications.notifications;
    }

    const previousIds = new Set(
      accountPreviousNotifications.notifications.map((item) => item.id),
    );

    return accountNotifications.notifications.filter(
      (notification) => !previousIds.has(notification.id),
    );
  });
}
