import type { AtlassifyNotification } from '../../../types';
import type { FilterDetails } from '../filters/types';

export interface GroupingConfig<T extends string> {
  groupByType: 'product' | T;
  getDetails: (key: T) => FilterDetails;
  getGroupKey: (notification: AtlassifyNotification) => T | undefined;
}
