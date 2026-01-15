import {
  mockAccountNotifications,
  mockSingleAtlassifyNotification,
} from '../../../__mocks__/notifications-mocks';

import { defaultSettings } from '../../../context/defaults';

import type { AtlassifyNotification, SettingsState } from '../../../types';

import { readStateFilter } from '.';

describe('renderer/utils/notifications/filters/readState.ts', () => {
  it('hasReadStateFilters', () => {
    expect(readStateFilter.hasFilters(defaultSettings)).toBe(false);

    expect(
      readStateFilter.hasFilters({
        ...defaultSettings,
        filterReadStates: ['read'],
      } as SettingsState),
    ).toBe(true);
  });

  it('isReadStateFilterSet', () => {
    const settings: SettingsState = {
      ...defaultSettings,
      filterReadStates: ['read'],
    };

    expect(readStateFilter.isFilterSet(settings, 'read')).toBe(true);

    expect(readStateFilter.isFilterSet(settings, 'unread')).toBe(false);
  });

  it('getReadStateFilterCount', () => {
    expect(
      readStateFilter.getFilterCount(mockAccountNotifications, 'read'),
    ).toBe(0);

    expect(
      readStateFilter.getFilterCount(mockAccountNotifications, 'unread'),
    ).toBe(2);
  });

  it('filterNotificationByReadState', () => {
    const mockNotification = {
      ...mockSingleAtlassifyNotification,
      readState: 'unread',
    } as AtlassifyNotification;

    expect(readStateFilter.filterNotification(mockNotification, 'read')).toBe(
      false,
    );

    expect(readStateFilter.filterNotification(mockNotification, 'unread')).toBe(
      true,
    );
  });
});
