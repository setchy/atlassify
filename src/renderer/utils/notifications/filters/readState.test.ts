import { vi } from 'vitest';

import { mockFilterStoreState } from '../../../__helpers__/test-utils';
import {
  mockAccountNotifications,
  mockSingleAtlassifyNotification,
} from '../../../__mocks__/notifications-mocks';

import type { AtlassifyNotification } from '../../../types';

import { readStateFilter } from '.';

// Mock the useFiltersStore
vi.mock('../../../hooks/useFiltersStore', () => ({
  default: {
    getState: vi.fn(),
  },
}));

import useFiltersStore from '../../../stores/useFiltersStore';

describe('renderer/utils/notifications/filters/readState.ts', () => {
  it('hasReadStateFilters', () => {
    mockFilterStoreState(useFiltersStore);

    expect(readStateFilter.hasFilters()).toBe(false);

    mockFilterStoreState(useFiltersStore, { readStates: ['read'] });

    expect(readStateFilter.hasFilters()).toBe(true);
  });

  it('isReadStateFilterSet', () => {
    mockFilterStoreState(useFiltersStore, { readStates: ['read'] });

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
