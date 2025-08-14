import {
  AtlassianIcon,
  BitbucketIcon,
  CompassIcon,
  ConfluenceIcon,
  HomeIcon,
  JiraIcon,
  JiraProductDiscoveryIcon,
  JiraServiceManagementIcon,
  TrelloIcon,
} from '@atlaskit/logo';

import type { Account, AtlassianProduct, ProductName } from '../types';
import {
  getCloudIDsForHostNames,
  getJiraProjectTypesByKeys,
} from './api/client';
import type { AtlassianHeadNotificationFragment } from './api/graphql/generated/graphql';
import { URLs } from './links';

// TODO remove duplication between this and filters/product PRODUCT_DETAILS
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
  home: {
    name: 'home',
    logo: HomeIcon,
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

// TODO #97 ideally we could get the Product Name from a response field instead of String manipulation
export async function getAtlassianProduct(
  account: Account,
  headNotification: AtlassianHeadNotificationFragment,
): Promise<AtlassianProduct> {
  const registrationProduct = headNotification.analyticsAttributes
    .filter((attribute) => attribute.key === 'registrationProduct')[0]
    .value?.toLowerCase();

  // const subProduct = headNotification.analyticsAttributes
  //   .filter((attribute) => attribute.key === 'subProduct')[0]
  //   .value?.toLowerCase();

  switch (registrationProduct) {
    case 'bitbucket':
      return PRODUCTS.bitbucket;
    case 'compass':
      return PRODUCTS.compass;
    case 'confluence':
      return PRODUCTS.confluence;
    case 'jira': {
      console.log(
        'ADAM PATH',
        JSON.stringify(headNotification.content.path[0]),
      );
      const hostName = new URL(headNotification.content.path[0].url).hostname;
      const cloudTenant = await getCloudIDsForHostNames(account, [hostName]);

      console.log('ADAM HOSTNAME ', hostName);
      console.log('ADAM CLOUD TENANT ', JSON.stringify(cloudTenant));

      const cloudID = cloudTenant?.data?.tenantContexts[0]?.cloudId;

      console.log('ADAM CLOUD ID ', cloudID);

      const jiraProject = await getJiraProjectTypesByKeys(account, cloudID, [
        headNotification.content.path[0].title,
      ]);

      console.log('ADAM JIRA PROJECT ', JSON.stringify(jiraProject));

      const jiraProjectType =
        jiraProject?.data?.jira.issuesByKey[0].projectField.project.projectType.toLowerCase();

      switch (jiraProjectType) {
        case 'product_discovery':
          return PRODUCTS['jira product discovery'];
        case 'service_desk':
          return PRODUCTS['jira service management'];

        default:
          return PRODUCTS['jira'];
      }
    }
    case 'opsgenie':
      return PRODUCTS['jira service management'];
    case 'team-central':
      return PRODUCTS.home;
    default:
      return PRODUCTS.unknown;
  }
}

export function getProductDetails(product: ProductName): AtlassianProduct {
  return PRODUCTS[product];
}
