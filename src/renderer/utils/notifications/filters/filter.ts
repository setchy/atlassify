import type { AtlassifyNotification, SettingsState } from '../../../types';
import { filterNotificationByAuthor, hasAuthorFilters } from './author';
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
    if (hasTimeSensitiveFilters(settings)) {
      return settings.filterTimeSensitive.some((ts) =>
        filterNotificationByTimeSensitive(notification, ts),
      );
    }

    if (hasCategoryFilters(settings)) {
      return settings.filterCategories.some((c) =>
        filterNotificationByCategory(notification, c),
      );
    }

    if (hasReadStateFilters(settings)) {
      return settings.filterReadStates.some((rs) =>
        filterNotificationByReadState(notification, rs),
      );
    }

    if (hasAuthorFilters(settings)) {
      return settings.filterAuthors.some((a) => {
        filterNotificationByAuthor(notification, a);
      });
    }

    if (hasProductFilters(settings)) {
      return settings.filterProducts.some((p) =>
        filterNotificationByProduct(notification, p),
      );
    }

    return true;
  });
}

export function hasAnyFiltersSet(settings: SettingsState): boolean {
  return (
    hasTimeSensitiveFilters(settings) ||
    hasCategoryFilters(settings) ||
    hasReadStateFilters(settings) ||
    hasAuthorFilters(settings) ||
    hasProductFilters(settings)
  );
}
