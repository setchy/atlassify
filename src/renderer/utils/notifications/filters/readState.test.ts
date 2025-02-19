import {
  mockAccountNotifications,
  mockSingleAtlassifyNotification,
} from '../../../__mocks__/notifications';
import { defaultSettings } from '../../../context/App';
import type { AtlassifyNotification, SettingsState } from '../../../types';
import {
  filterNotificationByReadState,
  getReadStateFilterCount,
  hasReadStateFilters,
  isReadStateFilterSet,
} from './readState';

describe('renderer/utils/notifications/filters/readState.ts', () => {
  it('hasReadStateFilters', () => {
    expect(hasReadStateFilters(defaultSettings)).toBe(false);

    expect(
      hasReadStateFilters({
        ...defaultSettings,
        filterReadStates: ['read'],
      } as SettingsState),
    ).toBe(true);
  });

  it('isReadStateFilterSet', () => {
    const settings = {
      ...defaultSettings,
      filterReadStates: ['read'],
    } as SettingsState;

    expect(isReadStateFilterSet(settings, 'read')).toBe(true);

    expect(isReadStateFilterSet(settings, 'unread')).toBe(false);
  });

  it('getReadStateFilterCount', () => {
    expect(getReadStateFilterCount(mockAccountNotifications, 'read')).toBe(0);

    expect(getReadStateFilterCount(mockAccountNotifications, 'unread')).toBe(2);
  });

  it('filterNotificationByReadState', () => {
    const mockNotification = {
      ...mockSingleAtlassifyNotification,
      readState: 'unread',
    } as AtlassifyNotification;

    expect(filterNotificationByReadState(mockNotification, 'read')).toBe(false);

    expect(filterNotificationByReadState(mockNotification, 'unread')).toBe(
      true,
    );
  });
});
