import { useFiltersStore } from '../../../stores';

import type { AtlassifyNotification } from '../../../types';

import {
  actorFilter,
  categoryFilter,
  engagementFilter,
  productFilter,
  readStateFilter,
} from '.';

/**
 * Applies all active notification filters to a list of notifications.
 * Each enabled filter type uses AND logic between filter types, with OR logic within a filter type
 * (i.e. a notification must match at least one value in each active filter group).
 *
 * @param notifications - The notifications to filter.
 * @returns The subset of notifications that pass all active filters.
 */
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
