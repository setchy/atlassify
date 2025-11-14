import type {
  Account,
  AccountNotifications,
  AtlassifyNotification,
  SettingsState,
} from '../../types';

/**
 * Remove notifications from the account notifications list.
 *
 * If fetching all notifications (read and unread), no need to remove from state
 * If delayNotificationState is enabled in settings, mark notifications as read instead of removing them.
 */
export function removeNotificationsForAccount(
  account: Account,
  settings: SettingsState,
  notificationsToRemove: AtlassifyNotification[],
  allNotifications: AccountNotifications[],
): AccountNotifications[] {
  if (notificationsToRemove.length === 0) {
    return allNotifications;
  }

  const notificationIDsToRemove = new Set(
    notificationsToRemove.map((n) => n.id),
  );

  return allNotifications.map((accountNotifications) =>
    account.id === accountNotifications.account.id
      ? {
          ...accountNotifications,
          notifications:
            settings.delayNotificationState ||
            !settings.fetchOnlyUnreadNotifications
              ? accountNotifications.notifications.map((notification) =>
                  notificationIDsToRemove.has(notification.id)
                    ? { ...notification, readState: 'read' }
                    : notification,
                )
              : accountNotifications.notifications.filter(
                  (notification) =>
                    !notificationIDsToRemove.has(notification.id),
                ),
        }
      : accountNotifications,
  );
}
