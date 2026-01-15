import type { AtlassifyNotification, SettingsState } from '../../../types';

import {
  actorFilter,
  categoryFilter,
  engagementFilter,
  productFilter,
  readStateFilter,
} from '.';

export function filterNotifications(
  notifications: AtlassifyNotification[],
  settings: SettingsState,
): AtlassifyNotification[] {
  return notifications.filter((notification) => {
    let passesFilters = true;

    if (engagementFilter.hasFilters(settings)) {
      passesFilters =
        passesFilters &&
        settings.filterEngagementStates.some((ts) =>
          engagementFilter.filterNotification(notification, ts),
        );
    }

    if (categoryFilter.hasFilters(settings)) {
      passesFilters =
        passesFilters &&
        settings.filterCategories.some((c) =>
          categoryFilter.filterNotification(notification, c),
        );
    }

    if (actorFilter.hasFilters(settings)) {
      passesFilters =
        passesFilters &&
        settings.filterActors.some((c) =>
          actorFilter.filterNotification(notification, c),
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

export function hasActiveFilters(settings: SettingsState): boolean {
  return (
    engagementFilter.hasFilters(settings) ||
    categoryFilter.hasFilters(settings) ||
    actorFilter.hasFilters(settings) ||
    readStateFilter.hasFilters(settings) ||
    productFilter.hasFilters(settings)
  );
}
