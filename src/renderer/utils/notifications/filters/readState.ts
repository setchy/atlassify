import type {
  AccountNotifications,
  AtlassifyNotification,
  ReadStateType,
  SettingsState,
} from '../../../types';
import type { Filter, FilterDetails } from './types';

const READ_STATE_DETAILS: Record<ReadStateType, FilterDetails> = {
  unread: {
    name: 'unread',
    description: 'Unread notification',
  },
  read: {
    name: 'read',
    description: 'Read notification',
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
