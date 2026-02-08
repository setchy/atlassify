import { vi } from 'vitest';

import { mockFilterStoreState } from '../../../__helpers__/test-utils';
import {
  mockAccountNotifications,
  mockSingleAtlassifyNotification,
} from '../../../__mocks__/notifications-mocks';

import type { AtlassifyNotification } from '../../../types';

import { engagementFilter, inferNotificationEngagementState } from '.';

// Mock the useFiltersStore
vi.mock('../../../hooks/useFiltersStore', () => ({
  default: {
    getState: vi.fn(),
  },
}));

import useFiltersStore from '../../../hooks/useFiltersStore';

describe('renderer/utils/notifications/filters/engagement.ts', () => {
  it('hasEngagementStateFilters', () => {
    mockFilterStoreState(useFiltersStore);

    expect(engagementFilter.hasFilters()).toBe(false);

    mockFilterStoreState(useFiltersStore, { engagementStates: ['comment'] });

    expect(engagementFilter.hasFilters()).toBe(true);
  });

  it('isEngagementStateFilterSet', () => {
    mockFilterStoreState(useFiltersStore, { engagementStates: ['comment'] });

    expect(engagementFilter.isFilterSet('comment')).toBe(true);

    expect(engagementFilter.isFilterSet('mention')).toBe(false);

    expect(engagementFilter.isFilterSet('reaction')).toBe(false);
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
