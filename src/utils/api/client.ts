import type { AxiosPromise } from 'axios';
import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import type { Account, Link, SettingsState, Token } from '../../types';
import { apiRequestAuth, apiRequestAuth2 } from './request';
import type { GraphQLResponse, MyNotifications, MyUserDetails } from './types';
import { getAPIUrl } from './utils';

/**
 * Get the authenticated user
 *
 * Endpoint documentation: https://docs.github.com/en/rest/users/users#get-the-authenticated-user
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

  return apiRequestAuth2(url.toString() as Link, 'POST', username, token, {
    query: print(QUERY),
    variables: {},
  });
}

/**
 * Perform a HEAD operation, used to validate that connectivity is established.
 *
 * Endpoint documentation: https://docs.github.com/en/rest/activity/notifications
 */
export function headNotifications(token: Token): AxiosPromise<void> {
  const url = getAPIUrl();
  url.pathname += 'notifications';

  return apiRequestAuth(url.toString() as Link, 'HEAD', token);
}

/**
 * List all notifications for the current user, sorted by most recently updated.
 *
 * Endpoint documentation: https://docs.github.com/en/rest/activity/notifications#list-notifications-for-the-authenticated-user
 */
export function listNotificationsForAuthenticatedUser(
  account: Account,
  _settings: SettingsState,
): AxiosPromise<GraphQLResponse<MyNotifications>> {
  const url = getAPIUrl();

  const QUERY = gql`
    query myNotifications(
        $readState: InfluentsNotificationReadState, 
        # $product: String
      ) {
      notifications {
        unseenNotificationCount
        notificationFeed(
          flat: true, 
          first: 100,
          filter: {
            readStateFilter: $readState
            # productFilter: $product
          }
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

  return apiRequestAuth2(
    url.toString() as Link,
    'POST',
    account.user.login,
    account.token,
    {
      query: print(QUERY),
      variables: {
        readState: 'unread',
        // product: settings.product,
      },
    },
  );
}

/**
 * Marks a thread as "read." Marking a thread as "read" is equivalent to
 * clicking a notification in your notification inbox on GitHub.
 *
 * Endpoint documentation: https://docs.github.com/en/rest/activity/notifications#mark-a-thread-as-read
 */
export function markNotificationThreadAsRead(
  threadId: string,
  token: Token,
): AxiosPromise<void> {
  const url = getAPIUrl();
  url.pathname += `notifications/threads/${threadId}`;

  return apiRequestAuth(url.toString() as Link, 'PATCH', token, {});
}

/**
 * Marks a thread as "done." Marking a thread as "done" is equivalent to marking a
 * notification in your notification inbox on GitHub as done.
 *
 * NOTE: This was added to GitHub Enterprise Server in version 3.13 or later.
 *
 * Endpoint documentation: https://docs.github.com/en/rest/activity/notifications#mark-a-thread-as-done
 */
export function markNotificationThreadAsDone(
  threadId: string,
  token: Token,
): AxiosPromise<void> {
  const url = getAPIUrl();
  url.pathname += `notifications/threads/${threadId}`;
  return apiRequestAuth(url.toString() as Link, 'DELETE', token, {});
}

/**
 * Marks all notifications in a repository as "read" for the current user.
 * If the number of notifications is too large to complete in one request,
 * you will receive a 202 Accepted status and GitHub will run an asynchronous
 * process to mark notifications as "read."
 *
 * Endpoint documentation: https://docs.github.com/en/rest/activity/notifications#mark-repository-notifications-as-read
 */
export function markRepositoryNotificationsAsRead(
  repoSlug: string,
  token: Token,
): AxiosPromise<void> {
  const url = getAPIUrl();
  url.pathname += `repos/${repoSlug}/notifications`;

  return apiRequestAuth(url.toString() as Link, 'PUT', token, {});
}
