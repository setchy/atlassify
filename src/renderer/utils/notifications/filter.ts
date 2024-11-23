import type { AtlassifyNotification, SettingsState } from '../../types';
import { FILTERS_TIME_SENSITIVE } from '../filters';

export function filterNotifications(
  notifications: AtlassifyNotification[],
  settings: SettingsState,
): AtlassifyNotification[] {
  return notifications.filter((notification) => {
    if (settings.filterTimeSensitive.length > 0) {
      return settings.filterTimeSensitive.some((ts) =>
        notification.message.includes(FILTERS_TIME_SENSITIVE[ts].contains),
      );
    }

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
