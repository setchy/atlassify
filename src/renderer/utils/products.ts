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

import type {
  Account,
  AtlassianProduct,
  CloudID,
  Hostname,
  JiraProjectKey,
  JiraProjectType,
  ProductName,
} from '../types';
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

const hostnameCloudIdCache = new Map<Hostname, CloudID>();
const jiraProjectTypeCache = new Map<JiraProjectKey, JiraProjectType>();

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
      const hostName = new URL(headNotification.content.path[0].url)
        .hostname as Hostname;

      // Check cache first
      let cloudID = hostnameCloudIdCache.get(hostName);

      if (!cloudID) {
        const cloudTenant = await getCloudIDsForHostNames(account, [hostName]);
        cloudID = cloudTenant?.data?.tenantContexts[0]?.cloudId as CloudID;
        if (cloudID) {
          hostnameCloudIdCache.set(hostName, cloudID);
        }
      }

      const pathTitle = headNotification.content.path[0].title;
      const projectKey = pathTitle.split('-')[0] as JiraProjectKey;

      // Check cache for project type
      let jiraProjectType = jiraProjectTypeCache.get(projectKey);

      if (!jiraProjectType) {
        const jiraProject = await getJiraProjectTypesByKeys(account, cloudID, [
          pathTitle,
        ]);
        jiraProjectType =
          jiraProject?.data?.jira.issuesByKey[0].projectField.project.projectType.toLowerCase() as JiraProjectType;
        if (jiraProjectType) {
          jiraProjectTypeCache.set(projectKey, jiraProjectType);
        }
      }

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
