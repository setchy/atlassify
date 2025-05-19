import type { Account, SettingsState, Token, Username } from '../../types';
import { Constants } from '../constants';
import { graphql } from './graphql/generated/gql';
import {
  InfluentsNotificationReadState,
  type MarkAsReadMutation,
  type MarkAsUnreadMutation,
  type MarkGroupAsReadMutation,
  type MarkGroupAsUnreadMutation,
  type MeQuery,
  type MyNotificationsQuery,
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
