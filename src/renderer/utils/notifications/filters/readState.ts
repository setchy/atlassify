import { EnvelopeIcon, EnvelopeOpenIcon } from '@heroicons/react/24/outline';

import { useFiltersStore } from '../../../stores';

import type {
  AccountNotifications,
  AtlassifyNotification,
  ReadStateType,
} from '../../../types';
import type { Filter, FilterDetails } from './types';

import i18n from '../../../i18n';

const READ_STATE_DETAILS: Record<ReadStateType, FilterDetails> = {
  unread: {
    name: i18n.t('filters.read_state.unread.title'),
    description: i18n.t('filters.read_state.unread.description'),
    heroicon: EnvelopeIcon,
  },
  read: {
    name: i18n.t('filters.read_state.read.title'),
    description: i18n.t('filters.read_state.read.description'),
    heroicon: EnvelopeOpenIcon,
  },
};

export const readStateFilter: Filter<ReadStateType> = {
  FILTER_TYPES: READ_STATE_DETAILS,

  getTypeDetails(type: ReadStateType): FilterDetails {
    return this.FILTER_TYPES[type];
  },

  hasFilters(): boolean {
    const filters = useFiltersStore.getState();
    return filters.readStates.length > 0;
  },

  isFilterSet(type: ReadStateType): boolean {
    const filters = useFiltersStore.getState();
    return filters.readStates.includes(type);
  },

  getFilterCount(
    accountNotifications: AccountNotifications[],
    readState: ReadStateType,
  ) {
    return accountNotifications.reduce(
      (memo, account) =>
        memo +
        account.notifications.filter((notification) =>
          this.filterNotification(notification, readState),
        ).length,
      0,
    );
  },

  filterNotification(
    notification: AtlassifyNotification,
    readState: ReadStateType,
  ): boolean {
    return notification.readState === readState;
  },
};
