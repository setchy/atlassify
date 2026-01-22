import type {
  Account,
  AccountNotifications,
  AtlassifyNotification,
  SettingsState,
} from '../../types';

/**
 * Determine if notifications should be removed from state or marked as read in-place.
 *
 */
export function shouldRemoveNotificationsFromState(
  settings: SettingsState,
): boolean {
  return (
    !settings.delayNotificationState &&
    settings.fetchOnlyUnreadNotifications &&
    settings.markAsReadOnOpen
  );
}

/**
 * Remove notifications from the account notifications list.
 *
 * If fetching all notifications (read and unread), no need to remove from state, just mark as read.
 * If delayNotificationState is enabled in settings, mark notifications as read instead of removing them.
 */
export function removeNotificationsForAccount(
  account: Account,
  settings: SettingsState,
  notificationsToRemove: AtlassifyNotification[],
  accountNotifications: AccountNotifications[],
): AccountNotifications[] {
  if (notificationsToRemove.length === 0) {
    return accountNotifications;
  }

  const notificationIDsToRemove = new Set(
    notificationsToRemove.map((notification) => notification.id),
  );

  const shouldRemove = shouldRemoveNotificationsFromState(settings);

  return accountNotifications.map((accountNotifications) =>
    account.id === accountNotifications.account.id
      ? {
          ...accountNotifications,
          notifications: shouldRemove
            ? accountNotifications.notifications.filter(
                (notification) => !notificationIDsToRemove.has(notification.id),
              )
            : accountNotifications.notifications.map((notification) =>
                notificationIDsToRemove.has(notification.id)
                  ? { ...notification, readState: 'read' }
                  : notification,
              ),
        }
      : accountNotifications,
  );
}
