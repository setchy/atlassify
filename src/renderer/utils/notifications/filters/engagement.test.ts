import {
  mockAccountNotifications,
  mockSingleAtlassifyNotification,
} from '../../../__mocks__/notifications-mocks';

import { defaultSettings } from '../../../context/defaults';

import type { AtlassifyNotification, SettingsState } from '../../../types';

import { engagementFilter, inferNotificationEngagementState } from '.';

describe('renderer/utils/notifications/filters/engagement.ts', () => {
  it('hasEngagementStateFilters', () => {
    expect(engagementFilter.hasFilters(defaultSettings)).toBe(false);

    expect(
      engagementFilter.hasFilters({
        ...defaultSettings,
        filterEngagementStates: ['comment'],
      }),
    ).toBe(true);
  });

  it('isEngagementStateFilterSet', () => {
    const settings: SettingsState = {
      ...defaultSettings,
      filterEngagementStates: ['comment'],
    };

    expect(engagementFilter.isFilterSet(settings, 'comment')).toBe(true);

    expect(engagementFilter.isFilterSet(settings, 'mention')).toBe(false);

    expect(engagementFilter.isFilterSet(settings, 'reaction')).toBe(false);
  });

  it('getEngagementStateFilterCount', () => {
    const mockAcctNotifications = mockAccountNotifications;
    mockAccountNotifications[0].notifications[0].message =
      'someone mentioned you on a page';

    expect(
      engagementFilter.getFilterCount(mockAcctNotifications, 'comment'),
    ).toBe(0);

    expect(
      engagementFilter.getFilterCount(mockAcctNotifications, 'mention'),
    ).toBe(1);

    expect(
      engagementFilter.getFilterCount(mockAcctNotifications, 'reaction'),
    ).toBe(0);
  });

  it('filterNotificationByEngagementState', () => {
    const mockNotification = {
      ...mockSingleAtlassifyNotification,
      message: 'someone mentioned you on a page',
    } as AtlassifyNotification;

    expect(
      engagementFilter.filterNotification(mockNotification, 'comment'),
    ).toBe(false);

    expect(
      engagementFilter.filterNotification(mockNotification, 'mention'),
    ).toBe(true);

    expect(
      engagementFilter.filterNotification(mockNotification, 'reaction'),
    ).toBe(false);
  });

  describe('inferNotificationEngagementState', () => {
    it('should infer mention engagement state', () => {
      const mockNotification = {
        ...mockSingleAtlassifyNotification,
        message: 'someone mentioned you on a page',
      } as AtlassifyNotification;

      expect(inferNotificationEngagementState(mockNotification)).toBe(
        'mention',
      );
    });

    it('should infer comment engagement state', () => {
      const mockNotification = {
        ...mockSingleAtlassifyNotification,
        message: 'someone replied on a page',
      } as AtlassifyNotification;

      expect(inferNotificationEngagementState(mockNotification)).toBe(
        'comment',
      );
    });

    it('should infer reaction engagement state', () => {
      const mockNotification = {
        ...mockSingleAtlassifyNotification,
        message: 'someone reacted to your comment',
      } as AtlassifyNotification;

      expect(inferNotificationEngagementState(mockNotification)).toBe(
        'reaction',
      );
    });

    it('should infer reaction engagement state with emoji', () => {
      const mockNotification = {
        ...mockSingleAtlassifyNotification,
        message: 'someone reacted 🍻 to your comment',
      } as AtlassifyNotification;

      expect(inferNotificationEngagementState(mockNotification)).toBe(
        'reaction',
      );
    });

    it('should return null if no engagement state can be inferred from message', () => {
      const mockNotification = {
        ...mockSingleAtlassifyNotification,
        message: 'mentionedreplied on a page',
      } as AtlassifyNotification;

      expect(inferNotificationEngagementState(mockNotification)).toBeNull();
    });
  });
});
