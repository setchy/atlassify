import type {
  AccountNotifications,
  AtlassifyNotification,
  ProductName,
  SettingsState,
} from '../../../types';
import { PRODUCTS } from '../../products';
import type { Filter, FilterDetails } from './types';

export const PRODUCT_DETAILS: Record<ProductName, FilterDetails> = Object?.keys(
  PRODUCTS,
).reduce(
  (details, key) => {
    const product = PRODUCTS[key as ProductName];
    details[key as ProductName] = {
      name: product.name,
      description: `Notifications related to ${product.name}`,
      logo: product.logo,
    };
    return details;
  },
  {} as Record<ProductName, FilterDetails>,
);

export const productFilter: Filter<ProductName> = {
  FILTER_TYPES: PRODUCT_DETAILS,

  getTypeDetails(type: ProductName) {
    return this.FILTER_TYPES[type];
  },

  hasFilters(settings: SettingsState): boolean {
    return settings.filterProducts.length > 0;
  },

  isFilterSet(settings: SettingsState, product: ProductName): boolean {
    return settings.filterProducts.includes(product);
  },

  getFilterCount(notifications: AccountNotifications[], product: ProductName) {
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
    product: ProductName,
  ): boolean {
    return notification.product.name === product;
  },
};
