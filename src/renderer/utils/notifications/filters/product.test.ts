import {
  mockAccountNotifications,
  mockSingleAtlassifyNotification,
} from '../../../__mocks__/notifications-mocks';

import { defaultSettings } from '../../../context/defaults';

import type { AtlassifyNotification, SettingsState } from '../../../types';

import { PRODUCTS } from '../../products';
import { productFilter } from '.';

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
    const settings: SettingsState = {
      ...defaultSettings,
      filterProducts: ['bitbucket'],
    };

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
      product: PRODUCTS.jira,
    } as AtlassifyNotification;

    expect(
      productFilter.filterNotification(mockNotification, 'bitbucket'),
    ).toBe(false);

    expect(productFilter.filterNotification(mockNotification, 'jira')).toBe(
      true,
    );
  });
});
