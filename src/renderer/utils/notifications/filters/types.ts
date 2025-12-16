import type { NewCoreIconProps } from '@atlaskit/icon';
import type { LogoProps } from '@atlaskit/logo';

import type {
  AccountNotifications,
  AtlassifyNotification,
  SettingsState,
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

  hasFilters(settings: SettingsState): boolean;

  isFilterSet(settings: SettingsState, type: T): boolean;

  getFilterCount(accountNotifications: AccountNotifications[], type: T): number;

  filterNotification(notification: AtlassifyNotification, type: T): boolean;
}
