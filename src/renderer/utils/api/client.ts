import type { Account, SettingsState, Token, Username } from '../../types';
import { Constants } from '../constants';
import { graphql } from './graphql/generated/gql';
import {
  InfluentsNotificationReadState,
  type JiraProjectTypesQuery,
  type MarkAsReadMutation,
  type MarkAsUnreadMutation,
  type MarkGroupAsReadMutation,
  type MarkGroupAsUnreadMutation,
  type MeQuery,
  type MyNotificationsQuery,
  type RetrieveNotificationsByGroupIdQuery,
  type RetrieveCloudIDsForHostNamesQuery,
} from './graphql/generated/graphql';
import { performHeadRequest, performPostRequest } from './request';
import type { AtlassianGraphQLResponse } from './types';

/**
 * Check if provided credentials (username and token) are valid.
 *
 * @param account
 * @returns
 */
export function checkIfCredentialsAreValid(
  username: Username,
  token: Token,
): Promise<AtlassianGraphQLResponse<unknown>> {
  return performHeadRequest(username, token);
}

/**
 * Get the authenticated user
 *
 * Endpoint documentation: https://developer.atlassian.com/platform/atlassian-graphql-api/graphql
 */
export function getAuthenticatedUser(
  account: Account,
): Promise<AtlassianGraphQLResponse<MeQuery>> {
  const MeQuery = graphql(`
    query Me {
      me {
        user {
          accountId
          name
          picture
        }
      }
    }
  `);

  return performPostRequest(account, MeQuery);
}

/**
 * List all notifications for the current user.
 *
 * Endpoint documentation: https://developer.atlassian.com/platform/atlassian-graphql-api/graphql
 */
export function getNotificationsForUser(
  account: Account,
  settings: SettingsState,
): Promise<AtlassianGraphQLResponse<MyNotificationsQuery>> {
  const MyNotificationsQuery = graphql(`
    query MyNotifications
      (
        $readState: InfluentsNotificationReadState,
        $flat: Boolean = true,
        $first: Int
      ) 
      {
      notifications {
        unseenNotificationCount
        notificationFeed(
          flat: $flat, 
          first: $first,
          filter: {
            readStateFilter: $readState
          }
        ) {
          pageInfo {
            hasNextPage
          }
          nodes {
            ...AtlassianNotification
          }
        }
      }
    }
  `);

  return performPostRequest(account, MyNotificationsQuery, {
    first: Constants.MAX_NOTIFICATIONS_PER_ACCOUNT,
    flat: !settings.groupNotificationsByTitle,
    readState: settings.fetchOnlyUnreadNotifications
      ? InfluentsNotificationReadState.Unread
      : null,
  });
}

/**
 * Mark a notification as "read".
 *
 * Endpoint documentation: https://developer.atlassian.com/platform/atlassian-graphql-api/graphql
 */
export function markNotificationsAsRead(
  account: Account,
  notificationIds: string[],
): Promise<AtlassianGraphQLResponse<MarkAsReadMutation>> {
  const MarkAsReadMutation = graphql(`
    mutation MarkAsRead($notificationIDs: [String!]!) {
      notifications {
        markNotificationsByIdsAsRead(ids: $notificationIDs) 
      }
    }
  `);

  return performPostRequest(account, MarkAsReadMutation, {
    notificationIDs: notificationIds,
  });
}

/**
 * Mark a notification as "unread".
 *
 * Endpoint documentation: https://developer.atlassian.com/platform/atlassian-graphql-api/graphql
 */
export function markNotificationsAsUnread(
  account: Account,
  notificationIds: string[],
): Promise<AtlassianGraphQLResponse<MarkAsUnreadMutation>> {
  const MarkAsUnreadMutation = graphql(`
    mutation MarkAsUnread($notificationIDs: [String!]!) {
      notifications {
        markNotificationsByIdsAsUnread(ids: $notificationIDs) 
      }
    }
  `);

  return performPostRequest(account, MarkAsUnreadMutation, {
    notificationIDs: notificationIds,
  });
}

/**
 * Mark a notification group as "read".
 * TODO: Currently unused due to "quirks" with API behavior across different product notification types.
 *
 * Endpoint documentation: https://developer.atlassian.com/platform/atlassian-graphql-api/graphql
 */
export function markNotificationGroupAsRead(
  account: Account,
  notificationGroupId: string,
): Promise<AtlassianGraphQLResponse<MarkGroupAsReadMutation>> {
  const MarkGroupAsReadMutation = graphql(`
    mutation MarkGroupAsRead($groupId: String!) {
      notifications {
        markNotificationsByGroupIdAsRead(groupId: $groupId)
      }
    }
  `);

  return performPostRequest(account, MarkGroupAsReadMutation, {
    groupId: notificationGroupId,
  });
}

/**
 * Mark a notification group as "unread".
 * TODO: Currently unused due to "quirks" with API behavior across different product notification types.
 *
 * Endpoint documentation: https://developer.atlassian.com/platform/atlassian-graphql-api/graphql
 */
export function markNotificationGroupAsUnread(
  account: Account,
  notificationGroupId: string,
): Promise<AtlassianGraphQLResponse<MarkGroupAsUnreadMutation>> {
  const MarkGroupAsUnreadMutation = graphql(`
    mutation MarkGroupAsUnread($groupId: String!) {
      notifications {
        markNotificationsByGroupIdAsUnread(groupId: $groupId)
      }
    }
  `);

  return performPostRequest(account, MarkGroupAsUnreadMutation, {
    groupId: notificationGroupId,
  });
}

/**
 * Get notifications by group ID.
 * Endpoint documentation: https://developer.atlassian.com/platform/atlassian-graphql-api/graphql
 */
export function getNotificationsByGroupId(
  account: Account,
  settings: SettingsState,
  notificationGroupId: string,
  notificationGroupSize: number,
): Promise<AtlassianGraphQLResponse<RetrieveNotificationsByGroupIdQuery>> {
  const RetrieveNotificationsByGroupIdQuery = graphql(`
    query RetrieveNotificationsByGroupId(
      $groupId: String!,
      $first: Int,
      $readState: InfluentsNotificationReadState
    ) {
      notifications {
        notificationGroup(
          groupId: $groupId, 
          first: $first, 
          filter: { 
            readStateFilter: $readState 
          }
        ) {
          nodes {
            ...GroupNotificationDetails
          } 
        }
      }
    }
  `);

  return performPostRequest(account, RetrieveNotificationsByGroupIdQuery, {
    groupId: notificationGroupId,
    first: notificationGroupSize,
    readState: settings.fetchOnlyUnreadNotifications
      ? InfluentsNotificationReadState.Unread
      : null,
  });
}

/**
 * Get Jira Project Types by Keys
 * Endpoint documentation: https://developer.atlassian.com/platform/atlassian-graphql-api/graphql
 */
export function getJiraProjectTypesByKeys(
  account: Account,
  cloudId: string,
  keys: string[],
): Promise<AtlassianGraphQLResponse<JiraProjectTypesQuery>> {
  const JiraProjectTypesByKeysQuery = graphql(`
    query JiraProjectTypes(
      $cloudId: ID!,
      $keys: [String!]!
    ) {
      jira {
        issuesByKey(
          cloudId: $cloudId, 
          keys: $keys
        ) {
          id
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

  return performPostRequest(account, JiraProjectTypesByKeysQuery, {
    cloudId: cloudId,
    keys: keys,
  });
}

/**
 * Get Cloud IDs for Hostnames
 * Endpoint documentation: https://developer.atlassian.com/platform/atlassian-graphql-api/graphql
 */
export function getCloudIDsForHostNames(
  account: Account,
  hostNames: string[],
): Promise<AtlassianGraphQLResponse<RetrieveCloudIDsForHostNamesQuery>> {
  const CloudIDsQuery = graphql(`
    query RetrieveCloudIDsForHostNames(
      $hostNames: [String!]!
    ) {
      tenantContexts(hostNames: $hostNames) {
        cloudId
        hostName
      }
    }
  `);

  return performPostRequest(account, CloudIDsQuery, {
    hostNames: hostNames,
  });
}

/**
 * GraphQL Fragments used for generating types
 */
export const AtlassianNotificationFragment = graphql(`
    fragment AtlassianNotification on InfluentsNotificationHeadItem {
      groupId
      groupSize
      additionalActors {
        displayName
        avatarURL
      }
      headNotification {
        ...AtlassianHeadNotification
      }
    }
  `);

export const AtlassianHeadNotificationFragment = graphql(`
    fragment AtlassianHeadNotification on InfluentsNotificationItem {
      notificationId
      timestamp
      readState
      category
      content {
        type
        message
        url
        entity {
          title
          iconUrl
          url
        }
        path {
          title
          iconUrl
          url
        }
        actor {
          displayName
          avatarURL
        }
      }
      analyticsAttributes {
        key
        value
      }
    }
  `);

export const GroupNotificationDetailsFragment = graphql(`
  fragment GroupNotificationDetails on InfluentsNotificationItem {
    notificationId
    readState
  }
`);
