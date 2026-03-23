import {
  mockAccountNotifications,
  mockSingleAtlassifyNotification,
} from '../../../__mocks__/notifications-mocks';

import { useFiltersStore } from '../../../stores';

import type { AtlassifyNotification } from '../../../types';

import { actorFilter } from '.';

describe('renderer/utils/notifications/filters/actor.ts', () => {
  it('hasActorFilters', () => {
    expect(actorFilter.hasFilters()).toBe(false);

    useFiltersStore.setState({ actors: ['automation'] });

    expect(actorFilter.hasFilters()).toBe(true);
  });

  it('isActorFilterSet', () => {
    useFiltersStore.setState({ actors: ['user'] });

    expect(actorFilter.isFilterSet('user')).toBe(true);

    expect(actorFilter.isFilterSet('automation')).toBe(false);
  });

  it('getActorFilterCount', () => {
    const mockAcctNotifications = mockAccountNotifications;
    mockAccountNotifications[0].notifications[0].actor.displayName =
      'Automation for Jira';

    expect(actorFilter.getFilterCount(mockAcctNotifications, 'user')).toBe(1);

    expect(
      actorFilter.getFilterCount(mockAcctNotifications, 'automation'),
    ).toBe(1);
  });

  it('filterNotificationByActor', () => {
    const mockNotification = {
      ...mockSingleAtlassifyNotification,
      actor: {
        displayName: 'Automation for Jira',
      },
    } as AtlassifyNotification;

    expect(actorFilter.filterNotification(mockNotification, 'user')).toBe(
      false,
    );

    expect(actorFilter.filterNotification(mockNotification, 'automation')).toBe(
      true,
    );
  });
});
