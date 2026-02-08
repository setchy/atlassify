import EyeOpenIcon from '@atlaskit/icon/core/eye-open';
import FlagIcon from '@atlaskit/icon/core/flag';

import type {
  AccountNotifications,
  AtlassifyNotification,
  CategoryType,
} from '../../../types';
import type { Filter, FilterDetails } from './types';

import i18n from '../../../i18n';
import useFiltersStore from '../../../stores/useFiltersStore';

const CATEGORY_DETAILS: Record<CategoryType, FilterDetails> = {
  direct: {
    name: i18n.t('filters.category.direct.title'),
    description: i18n.t('filters.category.direct.description'),
    icon: FlagIcon,
  },
  watching: {
    name: i18n.t('filters.category.watching.title'),
    description: i18n.t('filters.category.watching.description'),
    icon: EyeOpenIcon,
  },
};

export const categoryFilter: Filter<CategoryType> = {
  FILTER_TYPES: CATEGORY_DETAILS,

  getTypeDetails(type: CategoryType): FilterDetails {
    return this.FILTER_TYPES[type];
  },

  hasFilters(): boolean {
    const filters = useFiltersStore.getState();
    return filters.categories.length > 0;
  },

  isFilterSet(type: CategoryType): boolean {
    const filters = useFiltersStore.getState();
    return filters.categories.includes(type);
  },

  getFilterCount(
    accountNotifications: AccountNotifications[],
    category: CategoryType,
  ) {
    return accountNotifications.reduce(
      (memo, account) =>
        memo +
        account.notifications.filter((notification) =>
          this.filterNotification(notification, category),
        ).length,
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
