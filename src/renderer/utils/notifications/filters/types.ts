import type { NewCoreIconProps, NewUtilityIconProps } from '@atlaskit/icon';
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
   * The icon for the filter.
   * @see {@link https://atlassian.design/components/icon/icon-explorer} for available icons.
   */
  icon?:
    | React.ComponentType<NewUtilityIconProps>
    | React.ComponentType<NewCoreIconProps>;

  /**
   * The logo for the filter.
   * @see {@link https://atlassian.design/components/logo/examples} for available logos.
   */
  // biome-ignore lint/suspicious/noExplicitAny: Requires a proper type
  logo?: any;
}

export interface Filter<T extends string> {
  FILTER_TYPES: Record<T, FilterDetails>;

  getTypeDetails(type: T): FilterDetails;

  hasFilters(settings: SettingsState): boolean;

  isFilterSet(settings: SettingsState, type: T): boolean;

  getFilterCount(notifications: AccountNotifications[], type: T): number;

  filterNotification(notification: AtlassifyNotification, type: T): boolean;
}
