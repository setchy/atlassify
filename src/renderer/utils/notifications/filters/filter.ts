import {
  categoryFilter,
  productFilter,
  readStateFilter,
  timeSensitiveFilter,
} from '.';
import type { AtlassifyNotification, SettingsState } from '../../../types';

export function filterNotifications(
  notifications: AtlassifyNotification[],
  settings: SettingsState,
): AtlassifyNotification[] {
  return notifications.filter((notification) => {
    let passesFilters = true;

    if (timeSensitiveFilter.hasFilters(settings)) {
      passesFilters =
        passesFilters &&
        settings.filterTimeSensitive.some((ts) =>
          timeSensitiveFilter.filterNotification(notification, ts),
        );
    }

    if (categoryFilter.hasFilters(settings)) {
      passesFilters =
        passesFilters &&
        settings.filterCategories.some((c) =>
          categoryFilter.filterNotification(notification, c),
        );
    }

    if (readStateFilter.hasFilters(settings)) {
      passesFilters =
        passesFilters &&
        settings.filterReadStates.some((rs) =>
          readStateFilter.filterNotification(notification, rs),
        );
    }

    if (productFilter.hasFilters(settings)) {
      passesFilters =
        passesFilters &&
        settings.filterProducts.some((p) =>
          productFilter.filterNotification(notification, p),
        );
    }

    return passesFilters;
  });
}

export function hasAnyFiltersSet(settings: SettingsState): boolean {
  return (
    timeSensitiveFilter.hasFilters(settings) ||
    categoryFilter.hasFilters(settings) ||
    readStateFilter.hasFilters(settings) ||
    productFilter.hasFilters(settings)
  );
}
