import type {
  Account,
  Hostname,
  SettingsState,
  Token,
  Username,
} from '../../types';
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
  type RetrieveCloudIDsForHostnamesQuery,
  type RetrieveNotificationsByGroupIdQuery,
} from './graphql/generated/graphql';
import {
  performRequestForAccount,
  performRequestForCredentials,
} from './request';
import type { AtlassianGraphQLResponse } from './types';

/**
 * Check if provided credentials (username and token) are valid.
 *
 */
export function checkIfCredentialsAreValid(
  username: Username,
  token: Token,
): Promise<AtlassianGraphQLResponse<MeQuery>> {
  return performRequestForCredentials(username, token, MeQueryDocument);
}

/**
 * Get the authenticated user
 *
 * Endpoint documentation: https://developer.atlassian.com/platform/atlassian-graphql-api/graphql
 */
export function getAuthenticatedUser(
  account: Account,
): Promise<AtlassianGraphQLResponse<MeQuery>> {
  return performRequestForAccount(account, MeQueryDocument);
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
  const MyNotificationsDocument = graphql(`
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

  return performRequestForAccount(account, MyNotificationsDocument, {
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
  const MarkAsReadDocument = graphql(`
    mutation MarkAsRead($notificationIDs: [String!]!) {
      notifications {
        markNotificationsByIdsAsRead(ids: $notificationIDs) 
      }
    }
  `);

  return performRequestForAccount(account, MarkAsReadDocument, {
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
  const MarkAsUnreadDocument = graphql(`
    mutation MarkAsUnread($notificationIDs: [String!]!) {
      notifications {
        markNotificationsByIdsAsUnread(ids: $notificationIDs) 
      }
    }
  `);

  return performRequestForAccount(account, MarkAsUnreadDocument, {
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
 * Mark a notification group as "unread".
 * TODO: Currently unused due to "quirks" with API behavior across different product notification types.
 *
 * Endpoint documentation: https://developer.atlassian.com/platform/atlassian-graphql-api/graphql
 */
export function markNotificationGroupAsUnread(
  account: Account,
  notificationGroupId: string,
): Promise<AtlassianGraphQLResponse<MarkGroupAsUnreadMutation>> {
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
 * Get notifications by group ID.
 * Endpoint documentation: https://developer.atlassian.com/platform/atlassian-graphql-api/graphql
 */
export function getNotificationsByGroupId(
  account: Account,
  settings: SettingsState,
  notificationGroupId: string,
  notificationGroupSize: number,
): Promise<AtlassianGraphQLResponse<RetrieveNotificationsByGroupIdQuery>> {
  const RetrieveNotificationsByGroupIdDocument = graphql(`
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

  return performRequestForAccount(
    account,
    RetrieveNotificationsByGroupIdDocument,
    {
      groupId: notificationGroupId,
      first: notificationGroupSize,
      readState: settings.fetchOnlyUnreadNotifications
        ? InfluentsNotificationReadState.Unread
        : null,
    },
  );
}

/**
 * GraphQL Documents
 */
const MeQueryDocument = graphql(`
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

/**
 * Get Jira Project Types by Keys
 * Endpoint documentation: https://developer.atlassian.com/platform/atlassian-graphql-api/graphql
 */
export function getJiraProjectTypesByKeys(
  account: Account,
  cloudId: string,
  keys: string[],
): Promise<AtlassianGraphQLResponse<JiraProjectTypesQuery>> {
  const JiraProjectTypesByKeysDocument = graphql(`
    query JiraProjectTypes(
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

/**
 * Get Cloud IDs for Hostnames
 * Endpoint documentation: https://developer.atlassian.com/platform/atlassian-graphql-api/graphql
 */
export function getCloudIDsForHostnames(
  account: Account,
  hostnames: Hostname[],
): Promise<AtlassianGraphQLResponse<RetrieveCloudIDsForHostnamesQuery>> {
  const CloudIDsForHostnamesDocument = graphql(`
    query RetrieveCloudIDsForHostnames(
      $hostNames: [String!]!
    ) {
      tenantContexts(hostNames: $hostNames) {
        cloudId
        hostName
      }
    }
  `);

  return performRequestForAccount(account, CloudIDsForHostnamesDocument, {
    hostNames: hostnames,
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
