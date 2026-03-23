import {
  mockAccountNotifications,
  mockSingleAtlassifyNotification,
} from '../../../__mocks__/notifications-mocks';

import { useFiltersStore } from '../../../stores';

import type { AtlassifyNotification } from '../../../types';

import { engagementFilter } from '.';

describe('renderer/utils/notifications/filters/engagement.ts', () => {
  it('hasEngagementStateFilters', () => {
    expect(engagementFilter.hasFilters()).toBe(false);

    useFiltersStore.setState({ engagementStates: ['mention'] });

    expect(engagementFilter.hasFilters()).toBe(true);
  });

  it('isEngagementStateFilterSet', () => {
    useFiltersStore.setState({ engagementStates: ['comment'] });

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
});
