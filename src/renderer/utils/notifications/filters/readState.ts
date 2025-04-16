import { EnvelopeIcon, EnvelopeOpenIcon } from '@heroicons/react/24/outline';

import i18n from '../../../i18n';
import type {
  AccountNotifications,
  AtlassifyNotification,
  ReadStateType,
  SettingsState,
} from '../../../types';
import type { Filter, FilterDetails } from './types';

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

  hasFilters(settings: SettingsState): boolean {
    return settings.filterReadStates.length > 0;
  },

  isFilterSet(settings: SettingsState, type: ReadStateType): boolean {
    return settings.filterReadStates.includes(type);
  },

  getFilterCount(
    notifications: AccountNotifications[],
    readState: ReadStateType,
  ) {
    return notifications.reduce(
      (memo, acc) =>
        memo +
        acc.notifications.filter((n) => this.filterNotification(n, readState))
          .length,
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
