import type { GroupByType } from '../../../stores/types';

import type { ProductType } from '../../../types';
import type { GroupingConfig } from './types';

import { actorFilter, inferNotificationActor } from '../filters/actor';
import { categoryFilter } from '../filters/category';
import {
  engagementFilter,
  inferNotificationEngagementState,
} from '../filters/engagement';
import { productFilter } from '../filters/product';

export const GROUPING_CONFIGS: Record<
  Exclude<GroupByType, 'none'>,
  GroupingConfig<string>
> = {
  product: {
    groupByType: 'product',
    getDetails: (type) => productFilter.getTypeDetails(type as ProductType),
    getGroupKey: (notification) => notification.product.type,
  },
  actor: {
    groupByType: 'actor',
    getDetails: (type) =>
      actorFilter.getTypeDetails(type as 'user' | 'automation'),
    getGroupKey: (notification) => inferNotificationActor(notification),
  },
  engagement: {
    groupByType: 'engagement',
    getDetails: (type) =>
      engagementFilter.getTypeDetails(
        type as 'mention' | 'comment' | 'reaction' | 'other',
      ),
    getGroupKey: (notification) =>
      inferNotificationEngagementState(notification),
  },
  category: {
    groupByType: 'category',
    getDetails: (type) =>
      categoryFilter.getTypeDetails(type as 'direct' | 'watching'),
    getGroupKey: (notification) => notification.category,
  },
};

export const GROUP_BY_OPTIONS: Exclude<GroupByType, 'none'>[] = [
  'product',
  'actor',
  'engagement',
  'category',
];

export function cycleGroupBy(current: GroupByType): GroupByType {
  const options: GroupByType[] = ['none', ...GROUP_BY_OPTIONS];
  const currentIndex = options.indexOf(current);
  const nextIndex = (currentIndex + 1) % options.length;
  return options[nextIndex];
}
