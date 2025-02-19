import {
  mockAccountNotifications,
  mockSingleAtlassifyNotification,
} from '../../../__mocks__/notifications';
import { defaultSettings } from '../../../context/App';
import type { AtlassifyNotification, SettingsState } from '../../../types';
import {
  filterNotificationByProduct,
  getProductFilterCount,
  hasProductFilters,
  isProductFilterSet,
} from './product';

describe('renderer/utils/notifications/filters/product.ts', () => {
  it('hasProductFilters', () => {
    expect(hasProductFilters(defaultSettings)).toBe(false);

    expect(
      hasProductFilters({
        ...defaultSettings,
        filterProducts: ['bitbucket'],
      } as SettingsState),
    ).toBe(true);
  });

  it('isProductFilterSet', () => {
    const settings = {
      ...defaultSettings,
      filterProducts: ['bitbucket'],
    } as SettingsState;

    expect(isProductFilterSet(settings, 'compass')).toBe(false);

    expect(isProductFilterSet(settings, 'bitbucket')).toBe(true);
  });

  it('getProductFilterCount', () => {
    expect(getProductFilterCount(mockAccountNotifications, 'bitbucket')).toBe(
      1,
    );

    expect(getProductFilterCount(mockAccountNotifications, 'jira')).toBe(0);
  });

  it('filterNotificationByProduct', () => {
    const mockNotification = {
      ...mockSingleAtlassifyNotification,
      product: {
        name: 'jira',
        logo: 'jira-logo',
      },
    } as AtlassifyNotification;

    expect(filterNotificationByProduct(mockNotification, 'bitbucket')).toBe(
      false,
    );

    expect(filterNotificationByProduct(mockNotification, 'jira')).toBe(true);
  });
});
