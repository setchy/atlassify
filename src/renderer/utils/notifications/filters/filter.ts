import type { AtlassifyNotification } from '../../../types';

import useFiltersStore from '../../../stores/useFiltersStore';
import {
  actorFilter,
  categoryFilter,
  engagementFilter,
  productFilter,
  readStateFilter,
} from '.';

export function filterNotifications(
  notifications: AtlassifyNotification[],
): AtlassifyNotification[] {
  const filters = useFiltersStore.getState();

  return notifications.filter((notification) => {
    let passesFilters = true;

    if (engagementFilter.hasFilters()) {
      passesFilters =
        passesFilters &&
        filters.engagementStates.some((ts) =>
          engagementFilter.filterNotification(notification, ts),
        );
    }

    if (categoryFilter.hasFilters()) {
      passesFilters =
        passesFilters &&
        filters.categories.some((c) =>
          categoryFilter.filterNotification(notification, c),
        );
    }

    if (actorFilter.hasFilters()) {
      passesFilters =
        passesFilters &&
        filters.actors.some((c) =>
          actorFilter.filterNotification(notification, c),
        );
    }

    if (readStateFilter.hasFilters()) {
      passesFilters =
        passesFilters &&
        filters.readStates.some((rs) =>
          readStateFilter.filterNotification(notification, rs),
        );
    }

    if (productFilter.hasFilters()) {
      passesFilters =
        passesFilters &&
        filters.products.some((p) =>
          productFilter.filterNotification(notification, p),
        );
    }

    return passesFilters;
  });
}

export function hasActiveFilters(): boolean {
  return (
    engagementFilter.hasFilters() ||
    categoryFilter.hasFilters() ||
    actorFilter.hasFilters() ||
    readStateFilter.hasFilters() ||
    productFilter.hasFilters()
  );
}
