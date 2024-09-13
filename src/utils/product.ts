import type {
  AtlassianNotification,
  AtlassianProduct,
  Product,
} from './api/types';

import {
  AtlassianIcon,
  BitbucketIcon,
  CompassIcon,
  ConfluenceIcon,
  JiraIcon,
} from '@atlaskit/logo';

export function getAtlassianProduct(
  notification: AtlassianNotification,
): AtlassianProduct {
  const productName = notification.headNotification.analyticsAttributes.filter(
    (attribute) => attribute.key === 'registrationProduct',
  )[0].value;

  switch (productName) {
    case 'bitbucket':
      return PRODUCTS.bitbucket;
    case 'compass':
      return PRODUCTS.compass;
    case 'confluence':
      return PRODUCTS.confluence;

    case 'jira':
      return PRODUCTS.jira;

    default:
      return PRODUCTS.unknown;
  }
}

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
  unknown: {
    name: 'unknown',
    description: 'Unknown description',
    icon: AtlassianIcon,
  },
};

export function getProductDetails(product: Product): AtlassianProduct {
  return PRODUCTS[product];
}
