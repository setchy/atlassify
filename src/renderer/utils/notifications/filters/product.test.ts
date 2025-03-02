import { productFilter } from '.';
import {
  mockAccountNotifications,
  mockSingleAtlassifyNotification,
} from '../../../__mocks__/notifications-mocks';
import { defaultSettings } from '../../../context/App';
import type { AtlassifyNotification, SettingsState } from '../../../types';

describe('renderer/utils/notifications/filters/product.ts', () => {
  it('hasProductFilters', () => {
    expect(productFilter.hasFilters(defaultSettings)).toBe(false);

    expect(
      productFilter.hasFilters({
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

    expect(productFilter.isFilterSet(settings, 'compass')).toBe(false);

    expect(productFilter.isFilterSet(settings, 'bitbucket')).toBe(true);
  });

  it('getProductFilterCount', () => {
    expect(
      productFilter.getFilterCount(mockAccountNotifications, 'bitbucket'),
    ).toBe(1);

    expect(productFilter.getFilterCount(mockAccountNotifications, 'jira')).toBe(
      0,
    );
  });

  it('filterNotificationByProduct', () => {
    const mockNotification = {
      ...mockSingleAtlassifyNotification,
      product: {
        name: 'jira',
        logo: 'jira-logo',
      },
    } as AtlassifyNotification;

    expect(
      productFilter.filterNotification(mockNotification, 'bitbucket'),
    ).toBe(false);

    expect(productFilter.filterNotification(mockNotification, 'jira')).toBe(
      true,
    );
  });
});
