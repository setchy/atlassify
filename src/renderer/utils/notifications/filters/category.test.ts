import { vi } from 'vitest';

import { mockFilterStoreState } from '../../../__helpers__/test-utils';
import {
  mockAccountNotifications,
  mockSingleAtlassifyNotification,
} from '../../../__mocks__/notifications-mocks';

import type { AtlassifyNotification } from '../../../types';

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
    mockFilterStoreState(useFiltersStore);

    expect(categoryFilter.hasFilters()).toBe(false);

    mockFilterStoreState(useFiltersStore, { categories: ['direct'] });

    expect(categoryFilter.hasFilters()).toBe(true);
  });

  it('isCategoryFilterSet', () => {
    mockFilterStoreState(useFiltersStore, { categories: ['direct'] });

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
