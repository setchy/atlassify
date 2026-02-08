import { vi } from 'vitest';

import { mockFilterStoreState } from '../../../__helpers__/test-utils';
import {
  mockAccountNotifications,
  mockSingleAtlassifyNotification,
} from '../../../__mocks__/notifications-mocks';

import type { AtlassifyNotification } from '../../../types';

import { PRODUCTS } from '../../products';
import { productFilter } from '.';

// Mock the useFiltersStore
vi.mock('../../../hooks/useFiltersStore', () => ({
  default: {
    getState: vi.fn(),
  },
}));

import useFiltersStore from '../../../hooks/useFiltersStore';

describe('renderer/utils/notifications/filters/product.ts', () => {
  it('hasProductFilters', () => {
    mockFilterStoreState(useFiltersStore);

    expect(productFilter.hasFilters()).toBe(false);

    mockFilterStoreState(useFiltersStore, { products: ['bitbucket'] });

    expect(productFilter.hasFilters()).toBe(true);
  });

  it('isProductFilterSet', () => {
    mockFilterStoreState(useFiltersStore, { products: ['bitbucket'] });

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
