import EyeOpenIcon from '@atlaskit/icon/core/eye-open';
import FlagIcon from '@atlaskit/icon/core/flag';

import type {
  AccountNotifications,
  AtlassifyNotification,
  CategoryType,
  SettingsState,
} from '../../../types';
import type { Filter, FilterDetails } from './types';

const CATEGORY_DETAILS: Record<CategoryType, FilterDetails> = {
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

export const categoryFilter: Filter<CategoryType> = {
  FILTER_TYPES: CATEGORY_DETAILS,

  getTypeDetails(type: CategoryType): FilterDetails {
    return this.FILTER_TYPES[type];
  },

  hasFilters(settings: SettingsState): boolean {
    return settings.filterCategories.length > 0;
  },

  isFilterSet(settings: SettingsState, type: CategoryType): boolean {
    return settings.filterCategories.includes(type);
  },

  getFilterCount(
    notifications: AccountNotifications[],
    category: CategoryType,
  ) {
    return notifications.reduce(
      (memo, acc) =>
        memo +
        acc.notifications.filter((n) => this.filterNotification(n, category))
          .length,
      0,
    );
  },

  filterNotification(
    notification: AtlassifyNotification,
    category: CategoryType,
  ): boolean {
    return notification.category === category;
  },
};
