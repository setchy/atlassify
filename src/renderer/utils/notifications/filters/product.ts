import i18n from '../../../i18n';
import type {
  AccountNotifications,
  AtlassifyNotification,
  SettingsState,
} from '../../../types';
import { PRODUCTS } from '../../products';
import type { AtlassianProduct, ProductType } from '../../products/types';
import type { Filter, FilterDetails } from './types';

export const productFilter: Filter<ProductType> = {
  get FILTER_TYPES() {
    return buildProductFilterDetails(PRODUCTS);
  },

  getTypeDetails(type: ProductType) {
    return this.FILTER_TYPES[type];
  },

  hasFilters(settings: SettingsState): boolean {
    return settings.filterProducts.length > 0;
  },

  isFilterSet(settings: SettingsState, product: ProductType): boolean {
    return settings.filterProducts.includes(product);
  },

  getFilterCount(notifications: AccountNotifications[], product: ProductType) {
    return notifications.reduce(
      (memo, acc) =>
        memo +
        acc.notifications.filter((n) => this.filterNotification(n, product))
          .length,
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
    (Object.keys(products) as ProductType[]).sort().map((type) => {
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
