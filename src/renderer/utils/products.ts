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

// Use a promise cache to avoid duplicate API calls for the same hostname
const hostnameCloudIdCache = new Map<Hostname, Promise<CloudID>>();
// Use a promise cache to avoid duplicate API calls for the same project key
const jiraProjectTypeCache = new Map<
  JiraProjectKey,
  Promise<JiraProjectType>
>();

// TODO #97 ideally we could get the Product Name from a response field instead of String manipulation

export async function getAtlassianProduct(
  account: Account,
  headNotification: AtlassianHeadNotificationFragment,
): Promise<AtlassianProduct> {
  const registrationProduct = headNotification.analyticsAttributes
    .filter((attribute) => attribute.key === 'registrationProduct')[0]
    .value?.toLowerCase();

  // TODO - Maybe one day we can reliably use subProduct for Jira product types
  //  const subProduct = headNotification.analyticsAttributes
  //   .filter((attribute) => attribute.key === 'subProduct')[0]
  //   .value?.toLowerCase();

  switch (registrationProduct) {
    case 'bitbucket':
      return PRODUCTS.bitbucket;
    case 'compass':
      return PRODUCTS.compass;
    case 'confluence':
      return PRODUCTS.confluence;
    case 'jira':
      return getJiraProduct(account, headNotification);
    case 'opsgenie':
      return PRODUCTS['jira service management'];
    case 'team-central':
      return PRODUCTS.home;
    default:
      return PRODUCTS.unknown;
  }
}

async function getJiraProduct(
  account: Account,
  headNotification: AtlassianHeadNotificationFragment,
): Promise<AtlassianProduct> {
  const hostName = new URL(headNotification.content.path[0].url)
    .hostname as Hostname;

  // Check cache for cloudID (promise-aware)
  let cloudIdPromise = hostnameCloudIdCache.get(hostName);
  if (!cloudIdPromise) {
    cloudIdPromise = (async () => {
      const cloudTenant = await getCloudIDsForHostNames(account, [hostName]);
      return cloudTenant?.data?.tenantContexts[0]?.cloudId as CloudID;
    })();
    hostnameCloudIdCache.set(hostName, cloudIdPromise);
  }
  const cloudID = await cloudIdPromise;

  const pathTitle = headNotification.content.path[0].title;
  const projectKey = pathTitle.split('-')[0] as JiraProjectKey;

  // Check cache for project type (promise-aware)
  let jiraProjectTypePromise = jiraProjectTypeCache.get(projectKey);
  if (!jiraProjectTypePromise) {
    jiraProjectTypePromise = (async () => {
      const jiraProject = await getJiraProjectTypesByKeys(account, cloudID, [
        pathTitle,
      ]);
      return jiraProject?.data?.jira.issuesByKey[0].projectField.project.projectType.toLowerCase() as JiraProjectType;
    })();
    jiraProjectTypeCache.set(projectKey, jiraProjectTypePromise);
  }
  const jiraProjectType = await jiraProjectTypePromise;

  switch (jiraProjectType) {
    case 'product_discovery':
      return PRODUCTS['jira product discovery'];
    case 'service_desk':
      return PRODUCTS['jira service management'];
    default:
      return PRODUCTS['jira'];
  }
}

export function getProductDetails(product: ProductName): AtlassianProduct {
  return PRODUCTS[product];
}
