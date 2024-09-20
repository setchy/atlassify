import type {
  AtlassianNotification,
  AtlassianProduct,
  ProductName,
} from './api/types';
import { Constants } from './constants';

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

export const PRODUCTS: Record<ProductName, AtlassianProduct> = {
  bitbucket: {
    name: 'bitbucket',
    icon: BitbucketIcon,
    home: Constants.ATLASSIAN_URLS.WEB.BITBUCKET_HOME,
  },
  compass: {
    name: 'compass',
    icon: CompassIcon,
  },
  confluence: {
    name: 'confluence',
    icon: ConfluenceIcon,
  },
  jira: {
    name: 'jira',
    icon: JiraIcon,
  },
  'jira product discovery': {
    name: 'jira product discovery',
    icon: JiraProductDiscoveryIcon,
  },
  'jira service management': {
    name: 'jira service management',
    icon: JiraServiceManagementIcon,
  },
  'team central (atlas)': {
    name: 'team central (atlas)',
    icon: AtlasIcon,
  },
  trello: {
    name: 'trello',
    icon: TrelloIcon,
  },
  unknown: {
    name: 'unknown',
    icon: AtlassianIcon,
  },
};

// TODO - ideally we could get this from a response field instead of String manipulation
export function getAtlassianProduct(
  notification: AtlassianNotification,
): AtlassianProduct {
  const registrationProduct = notification.headNotification.analyticsAttributes
    .filter((attribute) => attribute.key === 'registrationProduct')[0]
    .value?.toLowerCase();

  const subProduct = notification.headNotification.analyticsAttributes
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
