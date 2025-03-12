import type { AtlassianProduct, ProductName } from '../types';
import type { AtlassianHeadNotificationFragment } from './api/graphql/generated/graphql';
import { URLs } from './links';

import {
  AtlasIcon,
  AtlassianIcon,
  BitbucketIcon,
  CompassIcon,
  ConfluenceIcon,
  JiraIcon,
  JiraProductDiscoveryIcon,
  JiraServiceManagementIcon,
  TrelloIcon,
} from '@atlaskit/logo';

// TODO - remove duplication between this and filters/product PRODUCT_DETAILS
export const PRODUCTS: Record<ProductName, AtlassianProduct> = {
  bitbucket: {
    name: 'bitbucket',
    logo: BitbucketIcon,
    home: URLs.ATLASSIAN.WEB.BITBUCKET_HOME,
  },
  compass: {
    name: 'compass',
    logo: CompassIcon,
  },
  confluence: {
    name: 'confluence',
    logo: ConfluenceIcon,
  },
  jira: {
    name: 'jira',
    logo: JiraIcon,
  },
  'jira product discovery': {
    name: 'jira product discovery',
    logo: JiraProductDiscoveryIcon,
  },
  'jira service management': {
    name: 'jira service management',
    logo: JiraServiceManagementIcon,
  },
  'team central (atlas)': {
    name: 'team central (atlas)',
    logo: AtlasIcon,
  },
  trello: {
    name: 'trello',
    logo: TrelloIcon,
  },
  unknown: {
    name: 'unknown',
    logo: AtlassianIcon,
  },
};

// TODO ideally we could get the Product Name from a response field instead of String manipulation. See issue #97
export function getAtlassianProduct(
  headNotification: AtlassianHeadNotificationFragment,
): AtlassianProduct {
  const registrationProduct = headNotification.analyticsAttributes
    .filter((attribute) => attribute.key === 'registrationProduct')[0]
    .value?.toLowerCase();

  const subProduct = headNotification.analyticsAttributes
    .filter((attribute) => attribute.key === 'subProduct')[0]
    .value?.toLowerCase();

  switch (registrationProduct) {
    case 'bitbucket':
      return PRODUCTS.bitbucket;
    case 'compass':
      return PRODUCTS.compass;
    case 'confluence':
      return PRODUCTS.confluence;
    case 'jira':
      switch (subProduct) {
        case 'servicedesk':
          return PRODUCTS['jira service management'];
        case 'software':
          return PRODUCTS.jira;
        default:
          return PRODUCTS['jira product discovery'];
      }
    case 'team-central':
      return PRODUCTS['team central (atlas)'];
    default:
      return PRODUCTS.unknown;
  }
}

export function getProductDetails(product: ProductName): AtlassianProduct {
  return PRODUCTS[product];
}
