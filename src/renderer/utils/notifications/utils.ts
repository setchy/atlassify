import type { AccountNotifications, AtlassifyNotification } from '../../types';

/**
 * Find notifications that exist in newNotifications but not in previousNotifications
 */
export function getNewNotifications(
  previousAccountNotifications: AccountNotifications[],
  newAccountNotifications: AccountNotifications[],
): AtlassifyNotification[] {
  return newAccountNotifications.flatMap((accountNotifications) => {
    const accountPreviousNotifications = previousAccountNotifications.find(
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
