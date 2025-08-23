import type {
  AccountNotifications,
  AtlassifyNotification,
  SettingsState,
} from '../../../types';
import { PRODUCTS } from '../../products/catalog';
import type { ProductType } from '../../products/types';
import type { Filter, FilterDetails } from './types';

const PRODUCT_DETAILS: Record<ProductType, FilterDetails> = Object.fromEntries(
  Object.entries(PRODUCTS).map(([name, details]) => [
    name,
    {
      name: details.display,
      description: details.display,
      logo: details.logo as FilterDetails['logo'],
    } as FilterDetails,
  ]),
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
    return notification.product.type === product;
  },
};
