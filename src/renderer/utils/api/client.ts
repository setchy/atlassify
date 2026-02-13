import { QueryClient } from '@tanstack/react-query';

import { Constants } from '../../constants';

import useSettingsStore from '../../stores/useSettingsStore';

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
      refetchIntervalInBackground: true,
      staleTime: 30000, // 30 seconds
      networkMode: 'online',
    },
  },
});

/**
 * Check if provided credentials (username and token) are valid.
 *
 */
export function checkIfCredentialsAreValid(
  username: Username,
  token: Token,
): Promise<AtlassianGraphQLResponse<MeQuery>> {
  return performRequestForCredentials(username, token, MeDocument);
}

/**
 * Get the authenticated user
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
 * Mark a notification as "read".
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
 * Mark a notification as "unread".
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
 * Get Cloud IDs for Hostnames
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
    url,
    account,
  );

  return response.projectTypeKey;
}
