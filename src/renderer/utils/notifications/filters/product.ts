import type {
  AccountNotifications,
  AtlassianProduct,
  AtlassifyNotification,
  ProductType,
} from '../../../types';
import type { Filter, FilterDetails } from './types';

import i18n from '../../../i18n';
import useFiltersStore from '../../../stores/useFiltersStore';
import { PRODUCTS } from '../../products';

export const productFilter: Filter<ProductType> = {
  get FILTER_TYPES() {
    return buildProductFilterDetails(PRODUCTS);
  },

  getTypeDetails(type: ProductType) {
    return this.FILTER_TYPES[type];
  },

  hasFilters(): boolean {
    const filters = useFiltersStore.getState();
    return filters.products.length > 0;
  },

  isFilterSet(product: ProductType): boolean {
    const filters = useFiltersStore.getState();
    return filters.products.includes(product);
  },

  getFilterCount(
    accountNotifications: AccountNotifications[],
    product: ProductType,
  ) {
    return accountNotifications.reduce(
      (memo, account) =>
        memo +
        account.notifications.filter((notification) =>
          this.filterNotification(notification, product),
        ).length,
      0,
    );
  },

  filterNotification(
    notification: AtlassifyNotification,
    product: ProductType,
  ): boolean {
    // Match against the canonical product type (slug)
    return notification.product.type === product;
  },
};

function buildProductFilterDetails(
  products: typeof PRODUCTS,
): Record<ProductType, FilterDetails> {
  return Object.fromEntries(
    (Object.keys(products) as ProductType[]).map((type) => {
      const p: AtlassianProduct = products[type];

      return [
        type,
        {
          name: p.display,
          description: i18n.t('filters.products.description', {
            type: p.display,
          }),
          logo: p.logo,
        } as FilterDetails,
      ];
    }),
  ) as Record<ProductType, FilterDetails>;
}
