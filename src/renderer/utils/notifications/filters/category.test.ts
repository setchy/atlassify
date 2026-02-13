import {
  mockAccountNotifications,
  mockSingleAtlassifyNotification,
} from '../../../__mocks__/notifications-mocks';

import useFiltersStore from '../../../stores/useFiltersStore';

import type { AtlassifyNotification } from '../../../types';

import { categoryFilter } from '.';

describe('renderer/utils/notifications/filters/category.ts', () => {
  it('hasCategoryFilters', () => {
    expect(categoryFilter.hasFilters()).toBe(false);

    useFiltersStore.setState({ categories: ['direct'] });

    expect(categoryFilter.hasFilters()).toBe(true);
  });

  it('isCategoryFilterSet', () => {
    useFiltersStore.setState({ categories: ['direct'] });

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
