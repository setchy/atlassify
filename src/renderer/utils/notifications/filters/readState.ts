import type {
  AccountNotifications,
  AtlassifyNotification,
  ReadStateType,
  SettingsState,
} from '../../../types';
import type { FilterDetails } from './types';

export const FILTERS_READ_STATES: Record<ReadStateType, FilterDetails> = {
  unread: {
    name: 'unread',
    description: 'Unread notification',
  },
  read: {
    name: 'read',
    description: 'Read notification',
  },
};

export function getReadStateFilterDetails(
  readState: ReadStateType,
): FilterDetails {
  return FILTERS_READ_STATES[readState];
}

export function hasReadStateFilters(settings: SettingsState) {
  return settings.filterReadStates.length > 0;
}

export function isReadStateFilterSet(
  settings: SettingsState,
  readState: ReadStateType,
) {
  return settings.filterReadStates.includes(readState);
}

export function getReadStateFilterCount(
  notifications: AccountNotifications[],
  readState: ReadStateType,
) {
  return notifications.reduce(
    (memo, acc) =>
      memo +
      acc.notifications.filter((n) =>
        filterNotificationByReadState(n, readState),
      ).length,
    0,
  );
}

export function filterNotificationByReadState(
  notification: AtlassifyNotification,
  readState: ReadStateType,
): boolean {
  return notification.readState === readState;
}
