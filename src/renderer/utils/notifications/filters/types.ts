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
  icon?: React.ComponentType;
}
