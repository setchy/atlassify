import type { Account, CloudID, JiraProjectKey } from '../../../types';
import type { AtlassianGraphQLResponse } from '../types';

import { getCollabContextRoutingAri } from '../collabContextRouting';
import {
  MarkGroupAsReadDocument,
  type MarkGroupAsReadMutation,
  MarkGroupAsUnreadDocument,
  type MarkGroupAsUnreadMutation,
  RetrieveJiraProjectTypesDocument,
  type RetrieveJiraProjectTypesQuery,
} from '../graphql/generated/graphql';
import { performRequestForAccount } from '../request';

/**
 * TODO - the api client functions in this file are all unused due to different "quirks" with behavior. Ideally each of these would be used.
 */

/**
 * Experimental: Mark a notification group as "read".
 * Currently unused due to API behavior differences across product types.
 *
 * Endpoint documentation: https://developer.atlassian.com/platform/atlassian-graphql-api/graphql
 */
export function markNotificationGroupAsRead(
  account: Account,
  notificationGroupId: string,
  cloudId?: CloudID,
): Promise<AtlassianGraphQLResponse<MarkGroupAsReadMutation>> {
  return performRequestForAccount(account, MarkGroupAsReadDocument, {
    groupId: notificationGroupId,
    collabContextRoutingAri: getCollabContextRoutingAri(cloudId),
  });
}

/**
 * Experimental: Mark a notification group as "unread".
 * Currently unused due to API behavior differences across product types.
 *
 * Endpoint documentation: https://developer.atlassian.com/platform/atlassian-graphql-api/graphql
 */
export function markNotificationGroupAsUnread(
  account: Account,
  notificationGroupId: string,
  cloudId?: CloudID,
): Promise<AtlassianGraphQLResponse<MarkGroupAsUnreadMutation>> {
  return performRequestForAccount(account, MarkGroupAsUnreadDocument, {
    groupId: notificationGroupId,
    collabContextRoutingAri: getCollabContextRoutingAri(cloudId),
  });
}

/**
 * Experimental: Get Jira Project Types by Keys via GraphQL.
 * Unused due to scope/permissions quirks; REST path is preferred currently.
 *
 * Endpoint documentation: https://developer.atlassian.com/platform/atlassian-graphql-api/graphql
 */
export function getJiraProjectTypesByKeys(
  account: Account,
  cloudId: CloudID,
  keys: JiraProjectKey[],
): Promise<AtlassianGraphQLResponse<RetrieveJiraProjectTypesQuery>> {
  return performRequestForAccount(account, RetrieveJiraProjectTypesDocument, {
    cloudId: cloudId,
    keys: keys,
  });
}
