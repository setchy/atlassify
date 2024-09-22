import type {
  AccountNotifications,
  AtlassifyNotification,
  SettingsState,
} from '../../types';

export function removeNotifications(
  settings: SettingsState,
  notificationsToRemove: AtlassifyNotification[],
  allNotifications: AccountNotifications[],
): AccountNotifications[] {
  if (settings.delayNotificationState) {
    return allNotifications;
  }

  if (notificationsToRemove.length === 0) {
    return allNotifications;
  }

  const removeNotificationAccount = notificationsToRemove[0].account;
  const removeNotificationIDs = notificationsToRemove.map(
    (notification) => notification.id,
  );

  const accountIndex = allNotifications.findIndex(
    (accountNotifications) =>
      accountNotifications.account.id === removeNotificationAccount.id,
  );

  if (accountIndex !== -1) {
    const updatedNotifications = [...allNotifications];
    updatedNotifications[accountIndex] = {
      ...updatedNotifications[accountIndex],
      notifications: updatedNotifications[accountIndex].notifications.filter(
        (notification) => !removeNotificationIDs.includes(notification.id),
      ),
    };
    return updatedNotifications;
  }

  return allNotifications;
}
