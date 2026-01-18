import {
  mockAccountNotifications,
  mockSingleAtlassifyNotification,
} from '../../../__mocks__/notifications-mocks';

import { defaultSettings } from '../../../context/defaults';

import type { AtlassifyNotification, SettingsState } from '../../../types';

import { categoryFilter } from '.';

describe('renderer/utils/notifications/filters/category.ts', () => {
  it('hasCategoryFilters', () => {
    expect(categoryFilter.hasFilters(defaultSettings)).toBe(false);

    expect(
      categoryFilter.hasFilters({
        ...defaultSettings,
        filterCategories: ['direct'],
      } as SettingsState),
    ).toBe(true);
  });

  it('isCategoryFilterSet', () => {
    const settings: SettingsState = {
      ...defaultSettings,
      filterCategories: ['direct'],
    };

    expect(categoryFilter.isFilterSet(settings, 'watching')).toBe(false);

    expect(categoryFilter.isFilterSet(settings, 'direct')).toBe(true);
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
