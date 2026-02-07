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

    const previousMap = new Map(
      accountPreviousNotifications.notifications.map((item) => [
        item.id,
        item.readState,
      ]),
    );

    return accountNotifications.notifications.filter((notification) => {
      const prevState = previousMap.get(notification.id);
      // Include if: 1) ID doesn't exist (new notification), or
      // 2) readState changed from 'read' to 'unread' (sync failure recovery)
      return (
        !prevState ||
        (prevState === 'read' && notification.readState === 'unread')
      );
    });
  });
}
