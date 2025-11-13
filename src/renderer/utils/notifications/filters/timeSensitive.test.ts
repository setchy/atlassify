import {
  mockAccountNotifications,
  mockSingleAtlassifyNotification,
} from '../../../__mocks__/notifications-mocks';
import { defaultSettings } from '../../../context/defaults';
import type { AtlassifyNotification, SettingsState } from '../../../types';
import { inferNotificationSensitivity, timeSensitiveFilter } from '.';

describe('renderer/utils/notifications/filters/timeSensitive.ts', () => {
  it('hasTimeSensitiveFilters', () => {
    expect(timeSensitiveFilter.hasFilters(defaultSettings)).toBe(false);

    expect(
      timeSensitiveFilter.hasFilters({
        ...defaultSettings,
        filterTimeSensitive: ['comment'],
      }),
    ).toBe(true);
  });

  it('isTimeSensitiveFilterSet', () => {
    const settings: SettingsState = {
      ...defaultSettings,
      filterTimeSensitive: ['comment'],
    };

    expect(timeSensitiveFilter.isFilterSet(settings, 'comment')).toBe(true);

    expect(timeSensitiveFilter.isFilterSet(settings, 'mention')).toBe(false);

    expect(timeSensitiveFilter.isFilterSet(settings, 'reactions')).toBe(false);
  });

  it('getTimeSensitiveFilterCount', () => {
    const mockAcctNotifications = mockAccountNotifications;
    mockAccountNotifications[0].notifications[0].message =
      'someone mentioned you on a page';

    expect(
      timeSensitiveFilter.getFilterCount(mockAcctNotifications, 'comment'),
    ).toBe(0);

    expect(
      timeSensitiveFilter.getFilterCount(mockAcctNotifications, 'mention'),
    ).toBe(1);

    expect(
      timeSensitiveFilter.getFilterCount(mockAcctNotifications, 'reactions'),
    ).toBe(0);
  });

  it('filterNotificationByTimeSensitive', () => {
    const mockNotification = {
      ...mockSingleAtlassifyNotification,
      message: 'someone mentioned you on a page',
    } as AtlassifyNotification;

    expect(
      timeSensitiveFilter.filterNotification(mockNotification, 'comment'),
    ).toBe(false);

    expect(
      timeSensitiveFilter.filterNotification(mockNotification, 'mention'),
    ).toBe(true);

    expect(
      timeSensitiveFilter.filterNotification(mockNotification, 'reactions'),
    ).toBe(false);
  });

  describe('inferNotificationSensitivity', () => {
    it('should infer mention sensitivity', () => {
      const mockNotification = {
        ...mockSingleAtlassifyNotification,
        message: 'someone mentioned you on a page',
      } as AtlassifyNotification;

      expect(inferNotificationSensitivity(mockNotification)).toBe('mention');
    });

    it('should infer comment sensitivity', () => {
      const mockNotification = {
        ...mockSingleAtlassifyNotification,
        message: 'someone replied on a page',
      } as AtlassifyNotification;

      expect(inferNotificationSensitivity(mockNotification)).toBe('comment');
    });

    it('should infer reactions sensitivity', () => {
      const mockNotification = {
        ...mockSingleAtlassifyNotification,
        message: 'someone reacted to your comment',
      } as AtlassifyNotification;

      expect(inferNotificationSensitivity(mockNotification)).toBe('reactions');
    });

    it('should infer reactions sensitivity with emoji', () => {
      const mockNotification = {
        ...mockSingleAtlassifyNotification,
        message: 'someone reacted 🍻 to your comment',
      } as AtlassifyNotification;

      expect(inferNotificationSensitivity(mockNotification)).toBe('reactions');
    });

    it('should return null if no sensitivity can be inferred from message', () => {
      const mockNotification = {
        ...mockSingleAtlassifyNotification,
        message: 'mentionedreplied on a page',
      } as AtlassifyNotification;

      expect(inferNotificationSensitivity(mockNotification)).toBeNull();
    });
  });
});
