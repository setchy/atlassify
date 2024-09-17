import type {
  AtlassianNotification,
  AtlassianProduct,
  Product,
} from './api/types';

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

export const PRODUCTS: Record<Product, AtlassianProduct> = {
  bitbucket: {
    name: 'bitbucket',
    description: 'Bitbucket description',
    icon: BitbucketIcon,
  },
  compass: {
    name: 'compass',
    description: 'Compass description',
    icon: CompassIcon,
  },
  confluence: {
    name: 'confluence',
    description: 'Confluence description',
    icon: ConfluenceIcon,
  },
  jira: {
    name: 'jira',
    description: 'Jira description',
    icon: JiraIcon,
  },
  'jira product discovery': {
    name: 'jira product discovery',
    description: 'Jira product discovery description',
    icon: JiraProductDiscoveryIcon,
  },
  'jira service management': {
    name: 'jira service management',
    description: 'Jira service management description',
    icon: JiraServiceManagementIcon,
  },
  'team central (atlas)': {
    name: 'team central (atlas)',
    description: 'Team central (atlas) description',
    icon: AtlasIcon,
  },
  trello: {
    name: 'trello',
    description: 'Trello description',
    icon: TrelloIcon,
  },
  unknown: {
    name: 'unknown',
    description: 'Unknown description',
    icon: AtlassianIcon,
  },
};

export function getAtlassianProduct(
  notification: AtlassianNotification,
): AtlassianProduct {
  const registrationProduct =
    notification.headNotification.analyticsAttributes.filter(
      (attribute) => attribute.key === 'registrationProduct',
    )[0].value;

  const subProduct = notification.headNotification.analyticsAttributes.filter(
    (attribute) => attribute.key === 'subProduct',
  )[0].value;

  switch (registrationProduct) {
    case 'bitbucket':
      return PRODUCTS.bitbucket;
    case 'compass':
      return PRODUCTS.compass;
    case 'confluence':
      return PRODUCTS.confluence;
    case 'jira':
      switch (subProduct) {
        case 'serviceDesk':
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

export function getProductDetails(product: Product): AtlassianProduct {
  return PRODUCTS[product];
}
