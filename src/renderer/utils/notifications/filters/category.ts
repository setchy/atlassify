import EyeOpenIcon from '@atlaskit/icon/core/eye-open';
import FlagIcon from '@atlaskit/icon/core/flag';

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
    icon: FlagIcon,
  },
  watching: {
    name: 'watching',
    description: 'Watching notification',
    icon: EyeOpenIcon,
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
