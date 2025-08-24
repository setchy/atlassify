import type {
  Account,
  CloudID,
  Hostname,
  JiraProjectKey,
  SettingsState,
  Token,
  Username,
} from '../../types';
import { Constants } from '../constants';
import { graphql } from './graphql/generated/gql';
import {
  InfluentsNotificationReadState,
  type MarkAsReadMutation,
  type MarkAsUnreadMutation,
  type MeQuery,
  type MyNotificationsQuery,
  type RetrieveCloudIDsForHostnamesQuery,
  type RetrieveNotificationsByGroupIdQuery,
} from './graphql/generated/graphql';
import {
  performRESTRequestForAccount,
  performRequestForAccount,
  performRequestForCredentials,
} from './request';
import type {
  AtlassianGraphQLResponse,
  JiraProjectRestResponse,
  JiraProjectType,
} from './types';

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
 * Get notifications by group ID.
 *
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
 * Get Cloud IDs for Hostnames
 *
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
 * Get Jira Project Type by Project Key (via Jira Cloud REST API)
 *
 * Endpoint documentation: https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-projects/#api-rest-api-3-project-projectidorkey-get
 */
export async function getJiraProjectTypeByKey(
  account: Account,
  cloudId: CloudID,
  projectKey: JiraProjectKey,
): Promise<JiraProjectType> {
  const url = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/project/${projectKey}`;

  const response = await performRESTRequestForAccount<JiraProjectRestResponse>(
    account,
    url,
  );

  return response.projectTypeKey;
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
