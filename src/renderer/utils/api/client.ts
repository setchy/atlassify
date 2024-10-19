import type { AxiosPromise } from 'axios';
import type { Account, SettingsState, Token, Username } from '../../types';
import { Constants } from '../constants';
import { graphql } from './graphql/generated/gql';
import {
  InfluentsNotificationReadState,
  type MarkAsReadMutation,
  type MarkAsUnreadMutation,
  type MeQuery,
  type MyNotificationsQuery,
} from './graphql/generated/graphql';
import { performHeadRequest, performPostRequest } from './request';

/**
 * Check if provided credentials (username and token) are valid.
 *
 * @param account
 * @returns
 */
export function checkIfCredentialsAreValid(
  username: Username,
  token: Token,
): AxiosPromise<unknown> {
  return performHeadRequest(username, token);
}

/**
 * Get the authenticated user
 *
 * Endpoint documentation: https://developer.atlassian.com/platform/atlassian-graphql-api/graphql
 */
export function getAuthenticatedUser(
  account: Account,
): AxiosPromise<{ data: MeQuery }> {
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
): AxiosPromise<{ data: MyNotificationsQuery }> {
  const MyNotificationsQuery = graphql(`
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

    fragment AtlassianNotification on InfluentsNotificationHeadItem {
      groupId
      headNotification {
        ...AtlassianHeadNotification
      }
    }

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

  return performPostRequest(account, MyNotificationsQuery, {
    first: Constants.MAX_NOTIFICATIONS_PER_ACCOUNT,
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
): AxiosPromise<{ data: MarkAsReadMutation }> {
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
): AxiosPromise<{ data: MarkAsUnreadMutation }> {
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
