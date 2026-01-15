import type {
  Account,
  AtlassianProduct,
  CloudID,
  Hostname,
  JiraProjectKey,
} from '../../types';
import type { JiraProjectType } from '../api/types';

import {
  getCloudIDsForHostnames,
  getJiraProjectTypeByKey,
} from '../api/client';
import type { AtlassianHeadNotificationFragment } from '../api/graphql/generated/graphql';
import { rendererLogError } from '../logger';
import { PRODUCTS } from './catalog';

// Use a promise cache to avoid duplicate API calls for the same hostname
const hostnameCloudIdCache = new Map<Hostname, Promise<CloudID>>();
// Use a promise cache to avoid duplicate API calls for the same project key
const jiraProjectTypeCache = new Map<
  JiraProjectKey,
  Promise<JiraProjectType>
>();

// Test-only utility (tree-shakable) to clear caches between tests
export function __resetProductInferenceCaches() {
  hostnameCloudIdCache.clear();
  jiraProjectTypeCache.clear();
}

/**
 * Infer the Atlassian Product from notification analytic attributes
 */
export async function inferAtlassianProduct(
  account: Account,
  headNotification: AtlassianHeadNotificationFragment,
): Promise<AtlassianProduct> {
  const registrationProduct = headNotification.analyticsAttributes
    .find((attribute) => attribute.key === 'registrationProduct')
    ?.value?.toLowerCase();

  const subProduct = headNotification.analyticsAttributes
    .find((attribute) => attribute.key === 'subProduct')
    ?.value?.toLowerCase();

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
          return PRODUCTS.jira_service_management;
        default:
          return lookupJiraProjectType(account, headNotification);
      }
    case 'opsgenie':
      return PRODUCTS.jira_service_management;
    case 'people-and-teams-collective':
      return PRODUCTS.teams;
    case 'post-office':
      if (headNotification.content.message.includes('AI generated code')) {
        return PRODUCTS.rovo_dev;
      }
      return PRODUCTS.unknown;
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
  if (headNotification.content.path.length === 0) {
    return PRODUCTS.jira;
  }

  try {
    const hostName = new URL(headNotification.content.path[0].url)
      .hostname as Hostname;

    // Check cache for cloudID (promise-aware)
    let cloudIdPromise = hostnameCloudIdCache.get(hostName);
    if (cloudIdPromise === undefined) {
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
    if (jiraProjectTypePromise === undefined) {
      jiraProjectTypePromise = (async () => {
        const jiraProject = await getJiraProjectTypeByKey(
          account,
          cloudID,
          projectKey,
        );

        return jiraProject;
      })();
      jiraProjectTypeCache.set(projectKey, jiraProjectTypePromise);
    }

    const jiraProjectType = await jiraProjectTypePromise;

    switch (jiraProjectType) {
      case 'product_discovery':
        return PRODUCTS.jira_product_discovery;
      case 'service_desk':
        return PRODUCTS.jira_service_management;
      default:
        return PRODUCTS.jira;
    }
  } catch (error) {
    rendererLogError(
      'lookupJiraProjectType',
      'Error fetching Jira project type:',
      error,
    );
    return PRODUCTS.jira;
  }
}
