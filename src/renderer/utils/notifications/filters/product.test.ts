import {
  mockAccountNotifications,
  mockSingleAtlassifyNotification,
} from '../../../__mocks__/notifications-mocks';

import type { AtlassifyNotification } from '../../../types';

import useFiltersStore from '../../../stores/useFiltersStore';
import { PRODUCTS } from '../../products';
import { productFilter } from '.';

describe('renderer/utils/notifications/filters/product.ts', () => {
  beforeEach(() => {
    useFiltersStore.getState().reset();
  });

  it('hasProductFilters', () => {
    expect(productFilter.hasFilters()).toBe(false);

    useFiltersStore.setState({ products: ['bitbucket'] });

    expect(productFilter.hasFilters()).toBe(true);
  });

  it('isProductFilterSet', () => {
    useFiltersStore.setState({ products: ['bitbucket'] });

    expect(productFilter.isFilterSet('compass')).toBe(false);

    expect(productFilter.isFilterSet('bitbucket')).toBe(true);
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
