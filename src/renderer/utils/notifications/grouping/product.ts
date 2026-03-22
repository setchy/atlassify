import type { ProductType } from '../../../types';
import type { GroupingConfig } from './types';

import { productFilter } from '../filters/product';

export const PRODUCT_GROUPING_CONFIG: GroupingConfig<ProductType> = {
  groupByType: 'product' as const,
  getDetails: (type: ProductType) => productFilter.getTypeDetails(type),
  getGroupKey: (notification) => notification.product.type,
};
