import type { AxiosPromise } from 'axios';
import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import type { Account, Link, SettingsState, Token } from '../../types';
import { apiRequestAuth } from './request';
import type { GraphQLResponse, MyNotifications, MyUserDetails } from './types';
import { getAPIUrl } from './utils';

/**
 * Get the authenticated user
 *
 * Endpoint documentation: https://developer.atlassian.com/platform/atlassian-graphql-api/graphql
 */
export function getAuthenticatedUser(
  username: string,
  token: Token,
): AxiosPromise<GraphQLResponse<MyUserDetails>> {
  const url = getAPIUrl();

  const QUERY = gql`
      query me {
      me {
        user {
          accountId
          name
          picture
        }
      }
    }
  `;

  return apiRequestAuth(url.toString() as Link, 'POST', username, token, {
    query: print(QUERY),
    variables: {},
  });
}

/**
 * List all notifications for the current user.
 *
 * Endpoint documentation: https://developer.atlassian.com/platform/atlassian-graphql-api/graphql
 */
export function getNotificationsForUser(
  account: Account,
  _settings: SettingsState,
): AxiosPromise<GraphQLResponse<MyNotifications>> {
  const url = getAPIUrl();

  const QUERY = gql`
    query myNotifications
      # (
      #   # $readState: InfluentsNotificationReadState, 
      #   # $product: String
      # ) 
      {
      notifications {
        unseenNotificationCount
        notificationFeed(
          flat: true, 
          first: 1000,
          # filter: {
          #   # readStateFilter: $readState
          #   # productFilter: $product
          # }
        ) {
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
  `;

  return apiRequestAuth(
    url.toString() as Link,
    'POST',
    account.user.login,
    account.token,
    {
      query: print(QUERY),
      variables: {
        // readState: 'unread',
        // product: settings.product,
      },
    },
  );
}

/**
 * Mark a notification as "read".
 *
 * Endpoint documentation: https://developer.atlassian.com/platform/atlassian-graphql-api/graphql
 */
export function markNotificationsAsRead(
  account: Account,
  notificationIds: string[],
): AxiosPromise<void> {
  const url = getAPIUrl();

  const MUTATION = gql`
    mutation markAsRead($notificationIDs: [String!]!) {
      notifications {
        markNotificationsByIdsAsRead(ids: $notificationIDs) 
      }
    }
  `;

  return apiRequestAuth(
    url.toString() as Link,
    'POST',
    account.user.login,
    account.token,
    {
      query: print(MUTATION),
      variables: {
        notificationIDs: notificationIds,
      },
    },
  );
}

/**
 * Mark a notification as "unread".
 *
 * Endpoint documentation: https://developer.atlassian.com/platform/atlassian-graphql-api/graphql
 */
export function markNotificationsAsUnread(
  account: Account,
  notificationIds: string[],
): AxiosPromise<void> {
  const url = getAPIUrl();

  const MUTATION = gql`
    mutation markAsUnread($notificationIDs: [String!]!) {
      notifications {
        markNotificationsByIdsAsUnread(ids: $notificationIDs) 
      }
    }
  `;

  return apiRequestAuth(
    url.toString() as Link,
    'POST',
    account.user.login,
    account.token,
    {
      query: print(MUTATION),
      variables: {
        notificationIDs: notificationIds,
      },
    },
  );
}
