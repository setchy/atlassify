import type { AtlassifyNotification, SettingsState } from '../../types';

export function filterNotifications(
  notifications: AtlassifyNotification[],
  settings: SettingsState,
): AtlassifyNotification[] {
  return notifications.filter((notification) => {
    if (
      settings.filterCategories.length > 0 &&
      !settings.filterCategories.includes(notification.category)
    ) {
      return false;
    }

    if (
      settings.filterReadStates.length > 0 &&
      !settings.filterReadStates.includes(notification.readState)
    ) {
      return false;
    }

    if (
      settings.filterProducts.length > 0 &&
      !settings.filterProducts.includes(notification.product.name)
    ) {
      return false;
    }

    return true;
  });
}
