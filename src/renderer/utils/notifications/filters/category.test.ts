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

import { categoryFilter } from '.';

// Mock the useFiltersStore
vi.mock('../../../hooks/useFiltersStore', () => ({
  default: {
    getState: vi.fn(),
  },
}));

import useFiltersStore from '../../../hooks/useFiltersStore';

describe('renderer/utils/notifications/filters/category.ts', () => {
  it('hasCategoryFilters', () => {
    vi.mocked(useFiltersStore.getState).mockReturnValue({
      ...defaultFilterSettings,
    } as FilterSettingsState & {
      setFilters: any;
      updateFilter: any;
      clearFilters: any;
    });

    expect(categoryFilter.hasFilters()).toBe(false);

    vi.mocked(useFiltersStore.getState).mockReturnValue({
      ...defaultFilterSettings,
      categories: ['direct'],
    } as FilterSettingsState & {
      setFilters: any;
      updateFilter: any;
      clearFilters: any;
    });

    expect(categoryFilter.hasFilters()).toBe(true);
  });

  it('isCategoryFilterSet', () => {
    vi.mocked(useFiltersStore.getState).mockReturnValue({
      ...defaultFilterSettings,
      categories: ['direct'],
    } as FilterSettingsState & {
      setFilters: any;
      updateFilter: any;
      clearFilters: any;
    });

    expect(categoryFilter.isFilterSet('watching')).toBe(false);

    expect(categoryFilter.isFilterSet('direct')).toBe(true);
  });

  it('getCategoryFilterCount', () => {
    expect(
      categoryFilter.getFilterCount(mockAccountNotifications, 'watching'),
    ).toBe(0);

    expect(
      categoryFilter.getFilterCount(mockAccountNotifications, 'direct'),
    ).toBe(2);
  });

  it('filterNotificationByCategory', () => {
    const mockNotification = {
      ...mockSingleAtlassifyNotification,
      category: 'direct',
    } as AtlassifyNotification;

    expect(
      categoryFilter.filterNotification(mockNotification, 'watching'),
    ).toBe(false);

    expect(categoryFilter.filterNotification(mockNotification, 'direct')).toBe(
      true,
    );
  });
});
