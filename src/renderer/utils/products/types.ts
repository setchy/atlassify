import type { LogoProps } from '@atlaskit/logo';

import type { Link } from '../../types';

/**
 * Atlassian products which are currently supported by Atlassify.
 */
export type ProductType =
  | 'bitbucket'
  | 'confluence'
  | 'compass'
  | 'home'
  | 'jira'
  | 'jira_product_discovery'
  | 'jira_service_management'
  | 'teams'
  | 'unknown';

/**
 * Details for a specific Atlassian product.
 */
export interface AtlassianProduct {
  /**
   * The type of the product.
   */
  type: ProductType;

  /**
   * The display name of the product.
   */
  display: string;

  /**
   * The logo of the product.
   *
   * See https://atlassian.design/components/logo/examples for available logos.
   */
  logo?: React.ComponentType<LogoProps>;

  /**
   * The URL to the product's home page.
   */
  home?: Link;
}
