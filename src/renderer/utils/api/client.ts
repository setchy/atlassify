import { QueryClient } from '@tanstack/react-query';

import { Constants } from '../../constants';

import { useSettingsStore } from '../../stores';

import type {
  Account,
  CloudID,
  Hostname,
  JiraProjectKey,
  Token,
  Username,
} from '../../types';
import type {
  AtlassianGraphQLResponse,
  JiraProjectRestResponse,
  JiraProjectType,
} from './types';

import {
  InfluentsNotificationReadState,
  MarkAsReadDocument,
  type MarkAsReadMutation,
  MarkAsUnreadDocument,
  type MarkAsUnreadMutation,
  MeDocument,
  type MeQuery,
  MyNotificationsDocument,
  type MyNotificationsQuery,
  RetrieveCloudIDsForHostnamesDocument,
  type RetrieveCloudIDsForHostnamesQuery,
  RetrieveNotificationsByGroupIdDocument,
  type RetrieveNotificationsByGroupIdQuery,
} from './graphql/generated/graphql';
import {
  performRESTRequestForAccount,
  performRequestForAccount,
  performRequestForCredentials,
} from './request';

/**
 * Tanstack Query Client
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: Constants.QUERY_STALE_TIME_MS,
      gcTime: Constants.QUERY_GC_TIME_MS,
      networkMode: 'online',
    },
  },
});

/**
 * Check if provided credentials (username and token) are valid.
 *
 * @param username - The Atlassian account username (email address).
 * @param token - The API token to validate.
 * @returns Promise resolving to the GraphQL response containing the authenticated user's profile.
 */
export function checkIfCredentialsAreValid(
  username: Username,
  token: Token,
): Promise<AtlassianGraphQLResponse<MeQuery>> {
  return performRequestForCredentials(username, token, MeDocument);
}

/**
 * Get the authenticated user.
 *
 * @param account - The account to fetch the authenticated user for.
 * @returns Promise resolving to the GraphQL response containing the authenticated user's profile.
 *
 * Endpoint documentation: https://developer.atlassian.com/platform/atlassian-graphql-api/graphql
 */
export function getAuthenticatedUser(
  account: Account,
): Promise<AtlassianGraphQLResponse<MeQuery>> {
  return performRequestForAccount(account, MeDocument);
}

/**
 * List all notifications for the current user.
 *
 * @param account - The account to fetch notifications for.
 * @returns Promise resolving to the GraphQL response containing the notification feed.
 *
 * Endpoint documentation: https://developer.atlassian.com/platform/atlassian-graphql-api/graphql
 */
export function getNotificationsForUser(
  account: Account,
): Promise<AtlassianGraphQLResponse<MyNotificationsQuery>> {
  const settings = useSettingsStore.getState();

  return performRequestForAccount(account, MyNotificationsDocument, {
    first: Constants.MAX_NOTIFICATIONS_PER_ACCOUNT,
    flat: !settings.groupNotificationsByTitle,
    readState: settings.fetchOnlyUnreadNotifications
      ? InfluentsNotificationReadState.Unread
      : null,
  });
}

/**
 * Mark notifications as "read".
 *
 * @param account - The account the notifications belong to.
 * @param notificationIds - Array of notification IDs to mark as read.
 * @returns Promise resolving to the GraphQL response for the mark-as-read mutation.
 *
 * Endpoint documentation: https://developer.atlassian.com/platform/atlassian-graphql-api/graphql
 */
export function markNotificationsAsRead(
  account: Account,
  notificationIds: string[],
): Promise<AtlassianGraphQLResponse<MarkAsReadMutation>> {
  return performRequestForAccount(account, MarkAsReadDocument, {
    notificationIDs: notificationIds,
  });
}

/**
 * Mark notifications as "unread".
 *
 * @param account - The account the notifications belong to.
 * @param notificationIds - Array of notification IDs to mark as unread.
 * @returns Promise resolving to the GraphQL response for the mark-as-unread mutation.
 *
 * Endpoint documentation: https://developer.atlassian.com/platform/atlassian-graphql-api/graphql
 */
export function markNotificationsAsUnread(
  account: Account,
  notificationIds: string[],
): Promise<AtlassianGraphQLResponse<MarkAsUnreadMutation>> {
  return performRequestForAccount(account, MarkAsUnreadDocument, {
    notificationIDs: notificationIds,
  });
}

/**
 * Get notifications by group ID.
 *
 * @param account - The account to fetch notifications for.
 * @param notificationGroupId - The ID of the notification group.
 * @param notificationGroupSize - The total number of notifications in the group (used to set page size).
 * @returns Promise resolving to the GraphQL response containing notification group details.
 *
 * Endpoint documentation: https://developer.atlassian.com/platform/atlassian-graphql-api/graphql
 */
export function getNotificationsByGroupId(
  account: Account,
  notificationGroupId: string,
  notificationGroupSize: number,
): Promise<AtlassianGraphQLResponse<RetrieveNotificationsByGroupIdQuery>> {
  const settings = useSettingsStore.getState();
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
 * Get Cloud IDs for a list of hostnames.
 *
 * @param account - The account to use when making the API request.
 * @param hostnames - Array of Atlassian hostnames to resolve Cloud IDs for.
 * @returns Promise resolving to the GraphQL response containing the Cloud ID for each hostname.
 *
 * Endpoint documentation: https://developer.atlassian.com/platform/atlassian-graphql-api/graphql
 */
export function getCloudIDsForHostnames(
  account: Account,
  hostnames: Hostname[],
): Promise<AtlassianGraphQLResponse<RetrieveCloudIDsForHostnamesQuery>> {
  return performRequestForAccount(
    account,
    RetrieveCloudIDsForHostnamesDocument,
    {
      hostNames: hostnames,
    },
  );
}

/**
 * Get the Jira project type for a given project key (via Jira Cloud REST API).
 *
 * @param account - The account to authenticate the REST request.
 * @param cloudId - The Cloud ID of the Atlassian tenant hosting the Jira instance.
 * @param projectKey - The Jira project key (e.g. `"PROJ"`).
 * @returns Promise resolving to the project type key (e.g. `"software"`, `"service_desk"`, `"business"`).
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
    url,
    account,
  );

  return response.projectTypeKey;
}
