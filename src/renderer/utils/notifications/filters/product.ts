import i18n from '../../../i18n';
import type {
  AccountNotifications,
  AtlassifyNotification,
  SettingsState,
} from '../../../types';
import { PRODUCTS } from '../../products/catalog';
import type { AtlassianProduct, ProductType } from '../../products/types';
import type { Filter, FilterDetails } from './types';

// Derive filter details directly from the single PRODUCTS catalog source.
const PRODUCT_DETAILS: Record<ProductType, FilterDetails> = Object.fromEntries(
  (Object.keys(PRODUCTS) as ProductType[]).map((type) => {
    const product: AtlassianProduct = PRODUCTS[type];
    return [
      type,
      {
        name: product.display,
        description: i18n.t('filters.category.products.description', {
          type: product.display,
        }),
        logo: product.logo,
      } as FilterDetails,
    ];
  }),
) as Record<ProductType, FilterDetails>;

export const productFilter: Filter<ProductType> = {
  FILTER_TYPES: PRODUCT_DETAILS,

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
