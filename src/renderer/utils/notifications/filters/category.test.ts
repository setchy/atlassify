import {
  mockAccountNotifications,
  mockSingleAtlassifyNotification,
} from '../../../__mocks__/notifications';
import { defaultSettings } from '../../../context/App';
import type { AtlassifyNotification, SettingsState } from '../../../types';
import {
  filterNotificationByCategory,
  getCategoryFilterCount,
  hasCategoryFilters,
  isCategoryFilterSet,
} from './category';

describe('renderer/utils/notifications/filters/category.ts', () => {
  it('hasCategoryFilters', () => {
    expect(hasCategoryFilters(defaultSettings)).toBe(false);

    expect(
      hasCategoryFilters({
        ...defaultSettings,
        filterCategories: ['direct'],
      } as SettingsState),
    ).toBe(true);
  });

  it('isCategoryFilterSet', () => {
    const settings = {
      ...defaultSettings,
      filterCategories: ['direct'],
    } as SettingsState;

    expect(isCategoryFilterSet(settings, 'watching')).toBe(false);

    expect(isCategoryFilterSet(settings, 'direct')).toBe(true);
  });

  it('getCategoryFilterCount', () => {
    expect(getCategoryFilterCount(mockAccountNotifications, 'watching')).toBe(
      0,
    );

    expect(getCategoryFilterCount(mockAccountNotifications, 'direct')).toBe(2);
  });

  it('filterNotificationByCategory', () => {
    const mockNotification = {
      ...mockSingleAtlassifyNotification,
      category: 'direct',
    } as AtlassifyNotification;

    expect(filterNotificationByCategory(mockNotification, 'watching')).toBe(
      false,
    );

    expect(filterNotificationByCategory(mockNotification, 'direct')).toBe(true);
  });
});
