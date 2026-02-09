import {
  mockAccountNotifications,
  mockSingleAtlassifyNotification,
} from '../../../__mocks__/notifications-mocks';

import type { AtlassifyNotification } from '../../../types';

import useFiltersStore from '../../../stores/useFiltersStore';
import { defaultFiltersState } from '../../../stores/defaults';
import { readStateFilter } from '.';

describe('renderer/utils/notifications/filters/readState.ts', () => {
  beforeEach(() => {
    useFiltersStore.getState().reset();
  });
  it('hasReadStateFilters', () => {
    expect(readStateFilter.hasFilters()).toBe(false);

    useFiltersStore.setState({
      ...defaultFiltersState,
      readStates: ['read'],
    });

    expect(readStateFilter.hasFilters()).toBe(true);
  });

  it('isReadStateFilterSet', () => {
    useFiltersStore.setState({
      ...defaultFiltersState,
      readStates: ['read'],
    });

    expect(readStateFilter.isFilterSet('read')).toBe(true);

    expect(readStateFilter.isFilterSet('unread')).toBe(false);
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
