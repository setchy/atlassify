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
   * The notification title contains this phrase
   */
  contains?: string;

  /**
   * The notification title starts with this phrase
   */
  startsWith?: string;

  /**
   * The notification title does not start with this phrase
   */
  doesNotStartWith?: string;

  /**
   * The icon for the filter.
   * @see {@link https://atlassian.design/components/icon/icon-explorer} for available icons.
   */
  icon?: React.ComponentType;
}
