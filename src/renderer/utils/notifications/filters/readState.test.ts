import { vi } from 'vitest';

import {
  mockAccountNotifications,
  mockSingleAtlassifyNotification,
} from '../../../__mocks__/notifications-mocks';

import { defaultFilterSettings } from '../../../context/defaults';

import type {
  AtlassifyNotification,
  FilterSettingsState,
} from '../../../types';

import { readStateFilter } from '.';

// Mock the useFiltersStore
vi.mock('../../../hooks/useFiltersStore', () => ({
  default: {
    getState: vi.fn(),
  },
}));

import useFiltersStore from '../../../hooks/useFiltersStore';

describe('renderer/utils/notifications/filters/readState.ts', () => {
  it('hasReadStateFilters', () => {
    vi.mocked(useFiltersStore.getState).mockReturnValue({
      ...defaultFilterSettings,
    } as FilterSettingsState & {
      setFilters: any;
      updateFilter: any;
      clearFilters: any;
    });

    expect(readStateFilter.hasFilters()).toBe(false);

    vi.mocked(useFiltersStore.getState).mockReturnValue({
      ...defaultFilterSettings,
      readStates: ['read'],
    } as FilterSettingsState & {
      setFilters: any;
      updateFilter: any;
      clearFilters: any;
    });

    expect(readStateFilter.hasFilters()).toBe(true);
  });

  it('isReadStateFilterSet', () => {
    vi.mocked(useFiltersStore.getState).mockReturnValue({
      ...defaultFilterSettings,
      readStates: ['read'],
    } as FilterSettingsState & {
      setFilters: any;
      updateFilter: any;
      clearFilters: any;
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
