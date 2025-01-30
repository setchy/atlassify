import {
  mockAccountNotifications,
  mockSingleAtlassifyNotification,
} from '../../../__mocks__/notifications-mocks';
import { defaultSettings } from '../../../context/App';
import type { AtlassifyNotification, SettingsState } from '../../../types';
import {
  filterNotificationByTimeSensitive,
  getTimeSensitiveFilterCount,
  hasTimeSensitiveFilters,
  isTimeSensitiveFilterSet,
} from './timeSensitive';

describe('renderer/utils/notifications/filters/timeSensitive.ts', () => {
  it('hasTimeSensitiveFilters', () => {
    expect(hasTimeSensitiveFilters(defaultSettings)).toBe(false);

    expect(
      hasTimeSensitiveFilters({
        ...defaultSettings,
        filterTimeSensitive: ['comment'],
      } as SettingsState),
    ).toBe(true);
  });

  it('isTimeSensitiveFilterSet', () => {
    const settings = {
      ...defaultSettings,
      filterTimeSensitive: ['comment'],
    } as SettingsState;

    expect(isTimeSensitiveFilterSet(settings, 'comment')).toBe(true);

    expect(isTimeSensitiveFilterSet(settings, 'mention')).toBe(false);
  });

  it('getTimeSensitiveFilterCount', () => {
    const mockAcctNotifications = mockAccountNotifications;
    mockAccountNotifications[0].notifications[0].message =
      'someone mentioned you on a page';

    expect(getTimeSensitiveFilterCount(mockAcctNotifications, 'comment')).toBe(
      0,
    );

    expect(getTimeSensitiveFilterCount(mockAcctNotifications, 'mention')).toBe(
      1,
    );
  });

  it('filterNotificationByTimeSensitive', () => {
    const mockNotification = {
      ...mockSingleAtlassifyNotification,
      message: 'someone mentioned you on a page',
    } as AtlassifyNotification;

    expect(filterNotificationByTimeSensitive(mockNotification, 'comment')).toBe(
      false,
    );

    expect(filterNotificationByTimeSensitive(mockNotification, 'mention')).toBe(
      true,
    );
  });
});
