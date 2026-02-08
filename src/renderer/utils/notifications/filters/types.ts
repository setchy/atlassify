import type { NewCoreIconProps } from '@atlaskit/icon';
import type { LogoProps } from '@atlaskit/logo';

import type {
  AccountNotifications,
  AtlassifyNotification,
} from '../../../types';

/**
 * Details for a specific notification filter.
 */
export interface FilterDetails {
  /**
   * The name of the filter.
   */
  name: string;

  /**
   * The description of the filter.
   */
  description: string;

  /**
   * The atlaskit icon for the filter.
   *
   * See https://atlassian.design/components/icon/icon-explorer for available icons.
   */
  icon?: React.ComponentType<NewCoreIconProps>;

  /**
   * The atlaskit logo for the filter.
   *
   * See https://atlassian.design/components/logo/examples for available logos.
   */
  logo?: React.ComponentType<LogoProps>;

  /**
   * The hero icon for the filter.
   *
   * See https://heroicons.com/ for available heroicons.
   */
  heroicon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export interface Filter<T extends string> {
  FILTER_TYPES: Record<T, FilterDetails>;

  getTypeDetails(type: T): FilterDetails;

  /**
   * Check if any filters have been set.
   */
  hasFilters(): boolean;

  /**
   * Check if a specific filter is set.
   *
   * @param type filter value to check against
   */
  isFilterSet(type: T): boolean;

  /**
   * Return the count of notifications for a given filter type.
   *
   * @param accountNotifications Notifications
   * @param type Filter type to count
   */
  getFilterCount(accountNotifications: AccountNotifications[], type: T): number;

  /**
   * Perform notification filtering.
   *
   * @param notification Notifications
   * @param type filter value to use
   */
  filterNotification(notification: AtlassifyNotification, type: T): boolean;
}
