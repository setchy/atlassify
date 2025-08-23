import {
  AtlassianIcon,
  BitbucketIcon,
  CompassIcon,
  ConfluenceIcon,
  HomeIcon,
  JiraIcon,
  JiraProductDiscoveryIcon,
  JiraServiceManagementIcon,
  TeamsIcon,
} from '@atlaskit/logo';

import { logError } from '../../shared/logger';

import i18n from '../i18n';
import type {
  Account,
  AtlassianProduct,
  CloudID,
  Hostname,
  JiraProjectKey,
  JiraProjectType,
  ProductName,
} from '../types';
import { getCloudIDsForHostnames, getJiraProjectTypeByKey } from './api/client';
import type { AtlassianHeadNotificationFragment } from './api/graphql/generated/graphql';
import { URLs } from './links';

export const PRODUCTS: Record<ProductName, AtlassianProduct> = {
  bitbucket: {
    name: 'bitbucket',
    display: 'Bitbucket',
    logo: BitbucketIcon,
    home: URLs.ATLASSIAN.WEB.BITBUCKET_HOME,
  },
  compass: {
    name: 'compass',
    display: 'Compass',
    logo: CompassIcon,
  },
  confluence: {
    name: 'confluence',
    display: 'Confluence',
    logo: ConfluenceIcon,
  },
  home: {
    name: 'home',
    display: 'Atlassian Home',
    logo: HomeIcon,
  },
  jira: {
    name: 'jira',
    display: 'Jira',
    logo: JiraIcon,
  },
  'jira product discovery': {
    name: 'jira product discovery',
    display: 'Jira Product Discovery',
    logo: JiraProductDiscoveryIcon,
  },
  'jira service management': {
    name: 'jira service management',
    display: 'Jira Service Management',
    logo: JiraServiceManagementIcon,
  },
  teams: {
    name: 'teams',
    display: 'Atlassian Teams',
    logo: TeamsIcon,
  },
  unknown: {
    name: 'unknown',
    display: i18n.t('products.unknown'),
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

/**
 * Infer the Atlassian Product from notification analytic attributes
 *
 * TODO #97 ideally we could get the Product Name from a API response attribute instead of inference
 */
export async function getAtlassianProduct(
  account: Account,
  headNotification: AtlassianHeadNotificationFragment,
): Promise<AtlassianProduct> {
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
        case 'core':
        case 'software':
          return PRODUCTS.jira;
        case 'servicedesk':
          return PRODUCTS['jira service management'];
        default:
          return lookupJiraProjectType(account, headNotification);
      }
    case 'opsgenie':
      return PRODUCTS['jira service management'];
    case 'people-and-teams-collective':
      return PRODUCTS.teams;
    case 'team-central':
      return PRODUCTS.home;
    default:
      return PRODUCTS.unknown;
  }
}

async function lookupJiraProjectType(
  account: Account,
  headNotification: AtlassianHeadNotificationFragment,
): Promise<AtlassianProduct> {
  try {
    const hostName = new URL(headNotification.content.path[0].url)
      .hostname as Hostname;

    // Check cache for cloudID (promise-aware)
    let cloudIdPromise = hostnameCloudIdCache.get(hostName);
    if (typeof cloudIdPromise === 'undefined') {
      cloudIdPromise = (async () => {
        const cloudTenant = await getCloudIDsForHostnames(account, [hostName]);
        return cloudTenant?.data?.tenantContexts[0]?.cloudId as CloudID;
      })();
      hostnameCloudIdCache.set(hostName, cloudIdPromise);
    }
    const cloudID = await cloudIdPromise;

    const pathTitle = headNotification.content.path[0].title;
    const projectKey = pathTitle.split('-')[0] as JiraProjectKey;

    // Check cache for project type (promise-aware)
    let jiraProjectTypePromise = jiraProjectTypeCache.get(projectKey);
    if (typeof jiraProjectTypePromise === 'undefined') {
      jiraProjectTypePromise = (async () => {
        const jiraProject = await getJiraProjectTypeByKey(
          account,
          cloudID,
          pathTitle,
        );

        return jiraProject;
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
        return PRODUCTS.jira;
    }
  } catch (error) {
    logError(
      'lookupJiraProjectType',
      'Error fetching Jira project type:',
      error,
    );
    return PRODUCTS.jira;
  }
}

export function getProductDetails(product: ProductName): AtlassianProduct {
  return PRODUCTS[product];
}
