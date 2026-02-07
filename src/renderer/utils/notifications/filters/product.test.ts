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
    vi.mocked(useFiltersStore.getState).mockReturnValue({
      ...defaultFilterSettings,
    } as FilterSettingsState & {
      setFilters: any;
      updateFilter: any;
      clearFilters: any;
    });

    expect(productFilter.hasFilters()).toBe(false);

    vi.mocked(useFiltersStore.getState).mockReturnValue({
      ...defaultFilterSettings,
      products: ['bitbucket'],
    } as FilterSettingsState & {
      setFilters: any;
      updateFilter: any;
      clearFilters: any;
    });

    expect(productFilter.hasFilters()).toBe(true);
  });

  it('isProductFilterSet', () => {
    vi.mocked(useFiltersStore.getState).mockReturnValue({
      ...defaultFilterSettings,
      products: ['bitbucket'],
    } as FilterSettingsState & {
      setFilters: any;
      updateFilter: any;
      clearFilters: any;
    });

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
