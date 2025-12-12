import type { ExecutionResult } from 'graphql';

import type { Account, CloudID, JiraProjectKey } from '../../../types';
import { graphql } from '../graphql/generated/gql';
import type {
  MarkGroupAsReadMutation,
  MarkGroupAsUnreadMutation,
  RetrieveJiraProjectTypesQuery,
} from '../graphql/generated/graphql';
import { performRequestForAccount } from '../request';

/**
 * TODO the api client functions in this file are all unused due to different "quirks" with behavior. Ideally each of these would be used.
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
): Promise<ExecutionResult<MarkGroupAsReadMutation>> {
  const MarkGroupAsReadDocument = graphql(`
    mutation MarkGroupAsRead($groupId: String!) {
      notifications {
        markNotificationsByGroupIdAsRead(groupId: $groupId)
      }
    }
  `);

  return performRequestForAccount(account, MarkGroupAsReadDocument, {
    groupId: notificationGroupId,
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
): Promise<ExecutionResult<MarkGroupAsUnreadMutation>> {
  const MarkGroupAsUnreadDocument = graphql(`
    mutation MarkGroupAsUnread($groupId: String!) {
      notifications {
        markNotificationsByGroupIdAsUnread(groupId: $groupId)
      }
    }
  `);

  return performRequestForAccount(account, MarkGroupAsUnreadDocument, {
    groupId: notificationGroupId,
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
): Promise<ExecutionResult<RetrieveJiraProjectTypesQuery>> {
  const JiraProjectTypesByKeysDocument = graphql(`
    query RetrieveJiraProjectTypes(
      $cloudId: ID!,
      $keys: [String!]!
    ) {
      jira {
        issuesByKey(
          cloudId: $cloudId, 
          keys: $keys
        ) {
          key
          summary
          projectField {
            project {
              name
              projectTypeName
              projectType
            }
          }
        }
      }
    }
  `);

  return performRequestForAccount(account, JiraProjectTypesByKeysDocument, {
    cloudId: cloudId,
    keys: keys,
  });
}
