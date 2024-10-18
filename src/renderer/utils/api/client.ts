import type { AxiosPromise } from 'axios';
import type { Account, SettingsState, Token, Username } from '../../types';
import { Constants } from '../constants';
import { graphql } from './gql';
import {
  InfluentsNotificationReadState,
  type MarkAsReadMutation,
  type MarkAsUnreadMutation,
  type MeQuery,
  type MyNotificationsQuery,
} from './gql/graphql';
import { execute, performHeadRequest } from './request';
import type { GraphQLResponse } from './types';

/**
 * Check if provided credentials (username and token) are valid.
 *
 * @param account
 * @returns
 */
export function checkIfCredentialsAreValid(
  username: Username,
  token: Token,
): AxiosPromise<GraphQLResponse<boolean, unknown>> {
  return performHeadRequest(username, token);
}

/**
 * Get the authenticated user
 *
 * Endpoint documentation: https://developer.atlassian.com/platform/atlassian-graphql-api/graphql
 */
export function getAuthenticatedUser(account: Account): Promise<MeQuery> {
  const QUERY = graphql(`
    query me {
      me {
        user {
          accountId
          name
          picture
        }
      }
    }
  `);

  return execute(account, QUERY);
}

/**
 * List all notifications for the current user.
 *
 * Endpoint documentation: https://developer.atlassian.com/platform/atlassian-graphql-api/graphql
 */
export function getNotificationsForUser(
  account: Account,
  settings: SettingsState,
): Promise<MyNotificationsQuery> {
  const QUERY = graphql(`
    query myNotifications
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
            groupId
            headNotification {
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
          }
        }
      }
    }
  `);

  return execute(account, QUERY, {
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
): Promise<MarkAsReadMutation> {
  const MUTATION = graphql(`
    mutation markAsRead($notificationIDs: [String!]!) {
      notifications {
        markNotificationsByIdsAsRead(ids: $notificationIDs) 
      }
    }
  `);

  return execute(account, MUTATION, {
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
): Promise<MarkAsUnreadMutation> {
  const MUTATION = graphql(`
    mutation markAsUnread($notificationIDs: [String!]!) {
      notifications {
        markNotificationsByIdsAsUnread(ids: $notificationIDs) 
      }
    }
  `);

  return execute(account, MUTATION, {
    notificationIDs: notificationIds,
  });
}
