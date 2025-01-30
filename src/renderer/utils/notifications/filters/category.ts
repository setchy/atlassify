import FlagsIcon from '@atlaskit/icon/glyph/emoji/flags';
import WatchIcon from '@atlaskit/icon/glyph/watch';

import type {
  AccountNotifications,
  AtlassifyNotification,
  CategoryType,
  SettingsState,
} from '../../../types';
import type { FilterDetails } from './types';

export const FILTERS_CATEGORIES: Record<CategoryType, FilterDetails> = {
  direct: {
    name: 'direct',
    description: 'Direct notification',
    icon: FlagsIcon,
  },
  watching: {
    name: 'watching',
    description: 'Watching notification',
    icon: WatchIcon,
  },
};

export function getCategoryFilterDetails(
  category: CategoryType,
): FilterDetails {
  return FILTERS_CATEGORIES[category];
}

export function hasCategoryFilters(settings: SettingsState) {
  return settings.filterCategories.length > 0;
}

export function isCategoryFilterSet(
  settings: SettingsState,
  category: CategoryType,
) {
  return settings.filterCategories.includes(category);
}

export function getCategoryFilterCount(
  notifications: AccountNotifications[],
  category: CategoryType,
) {
  return notifications.reduce(
    (memo, acc) =>
      memo +
      acc.notifications.filter((n) => filterNotificationByCategory(n, category))
        .length,
    0,
  );
}

export function filterNotificationByCategory(
  notification: AtlassifyNotification,
  category: CategoryType,
): boolean {
  return notification.category === category;
}
