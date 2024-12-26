import type { Account, SettingsState, Token, Username } from '../../types';
import { Constants } from '../constants';
import { isReadOnlyFilterSet, isUnreadOnlyFilterSet } from '../filters';
import { graphql } from './graphql/generated/gql';
import {
  InfluentsNotificationReadState,
  type MarkAsReadMutation,
  type MarkAsUnreadMutation,
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
        $first: Int
      ) 
      {
      notifications {
        unseenNotificationCount
        notificationFeed(
          flat: true, 
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

  let readStateQueryVariable = null;

  if (isUnreadOnlyFilterSet(settings)) {
    readStateQueryVariable = InfluentsNotificationReadState.Unread;
  }

  if (isReadOnlyFilterSet(settings)) {
    readStateQueryVariable = InfluentsNotificationReadState.Read;
  }

  return performPostRequest(account, MyNotificationsQuery, {
    first: Constants.MAX_NOTIFICATIONS_PER_ACCOUNT,
    readState: readStateQueryVariable,
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
 * GraphQL Fragments used for generating types
 */
export const AtlassianNotificationFragment = graphql(`
    fragment AtlassianNotification on InfluentsNotificationHeadItem {
      groupId
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
