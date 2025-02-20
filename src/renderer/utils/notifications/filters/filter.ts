import type { AtlassifyNotification, SettingsState } from '../../../types';
import { filterNotificationByCategory, hasCategoryFilters } from './category';
import { filterNotificationByProduct, hasProductFilters } from './product';
import {
  filterNotificationByReadState,
  hasReadStateFilters,
} from './readState';
import {
  filterNotificationByTimeSensitive,
  hasTimeSensitiveFilters,
} from './timeSensitive';

export function filterNotifications(
  notifications: AtlassifyNotification[],
  settings: SettingsState,
): AtlassifyNotification[] {
  return notifications.filter((notification) => {
    let passesFilters = true;

    if (hasTimeSensitiveFilters(settings)) {
      passesFilters =
        passesFilters &&
        settings.filterTimeSensitive.some((ts) =>
          filterNotificationByTimeSensitive(notification, ts),
        );
    }

    if (hasCategoryFilters(settings)) {
      passesFilters =
        passesFilters &&
        settings.filterCategories.some((c) =>
          filterNotificationByCategory(notification, c),
        );
    }

    if (hasReadStateFilters(settings)) {
      passesFilters =
        passesFilters &&
        settings.filterReadStates.some((rs) =>
          filterNotificationByReadState(notification, rs),
        );
    }

    if (hasProductFilters(settings)) {
      passesFilters =
        passesFilters &&
        settings.filterProducts.some((p) =>
          filterNotificationByProduct(notification, p),
        );
    }

    return passesFilters;
  });
}

export function hasAnyFiltersSet(settings: SettingsState): boolean {
  return (
    hasTimeSensitiveFilters(settings) ||
    hasCategoryFilters(settings) ||
    hasReadStateFilters(settings) ||
    hasProductFilters(settings)
  );
}
