import { mockAtlassianCloudAccount } from '../../__mocks__/account-mocks';
import { mockSingleAtlassifyNotification } from '../../__mocks__/notifications-mocks';

import { Constants } from '../../constants';

import { DEFAULT_SETTINGS_STATE } from '../../stores/defaults';
import useSettingsStore from '../../stores/useSettingsStore';

import type { CloudID, Hostname, JiraProjectKey } from '../../types';
import type {
  AtlassianGraphQLResponse,
  JiraProjectRestResponse,
} from './types';

import * as client from './client';
import {
  MeDocument,
  MyNotificationsDocument,
} from './graphql/generated/graphql';
import * as request from './request';

describe('renderer/utils/api/client.ts', () => {
  beforeEach(() => {
    vi.spyOn(request, 'performRequestForAccount').mockResolvedValue({
      data: {},
    } as AtlassianGraphQLResponse<unknown>);
    vi.spyOn(request, 'performRequestForCredentials').mockResolvedValue({
      data: {},
    } as AtlassianGraphQLResponse<unknown>);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('checkIfCredentialsAreValid - should validate credentials', async () => {
    await client.checkIfCredentialsAreValid(
      mockAtlassianCloudAccount.username,
      mockAtlassianCloudAccount.token,
    );

    expect(request.performRequestForCredentials).toHaveBeenCalledWith(
      mockAtlassianCloudAccount.username,
      mockAtlassianCloudAccount.token,
      MeDocument,
    );
  });

  it('getAuthenticatedUser - should fetch authenticated user details', async () => {
    await client.getAuthenticatedUser(mockAtlassianCloudAccount);

    expect(request.performRequestForAccount).toHaveBeenCalledWith(
      mockAtlassianCloudAccount,
      MeDocument,
    );
  });

  it('listNotificationsForAuthenticatedUser - should list notifications for user', async () => {
    await client.getNotificationsForUser(mockAtlassianCloudAccount);

    expect(request.performRequestForAccount).toHaveBeenCalledWith(
      mockAtlassianCloudAccount,
      MyNotificationsDocument,
      {
        first: Constants.MAX_NOTIFICATIONS_PER_ACCOUNT,
        flat: !DEFAULT_SETTINGS_STATE.groupNotificationsByTitle,
        readState: 'unread',
      },
    );
  });

  it('markNotificationsAsRead - should mark notifications as read', async () => {
    await client.markNotificationsAsRead(mockAtlassianCloudAccount, [
      mockSingleAtlassifyNotification.id,
    ]);

    expect(request.performRequestForAccount).toHaveBeenCalledWith(
      mockAtlassianCloudAccount,
      expect.stringContaining('mutation MarkAsRead'),
      {
        notificationIDs: [mockSingleAtlassifyNotification.id],
      },
    );
  });

  it('markNotificationsAsUnread - should mark notifications as unread', async () => {
    await client.markNotificationsAsUnread(mockAtlassianCloudAccount, [
      mockSingleAtlassifyNotification.id,
    ]);

    expect(request.performRequestForAccount).toHaveBeenCalledWith(
      mockAtlassianCloudAccount,
      expect.stringContaining('mutation MarkAsUnread'),
      {
        notificationIDs: [mockSingleAtlassifyNotification.id],
      },
    );
  });

  describe('getNotificationsByGroupId', () => {
    it('getNotificationsByGroupId - should fetch unread notifications by group id', async () => {
      const mockGroupSize = 5;

      useSettingsStore.setState({
        ...DEFAULT_SETTINGS_STATE,
        fetchOnlyUnreadNotifications: true,
      });

      await client.getNotificationsByGroupId(
        mockAtlassianCloudAccount,
        mockSingleAtlassifyNotification.notificationGroup.id,
        mockGroupSize,
      );

      expect(request.performRequestForAccount).toHaveBeenCalledWith(
        mockAtlassianCloudAccount,
        expect.stringContaining('query RetrieveNotificationsByGroupId'),
        {
          groupId: mockSingleAtlassifyNotification.notificationGroup.id,
          first: mockGroupSize,
          readState: 'unread',
        },
      );
    });

    it('getNotificationsByGroupId - should fetch all notifications by group id', async () => {
      const mockGroupSize = 5;

      useSettingsStore.setState({
        ...DEFAULT_SETTINGS_STATE,
        fetchOnlyUnreadNotifications: false,
      });

      await client.getNotificationsByGroupId(
        mockAtlassianCloudAccount,
        mockSingleAtlassifyNotification.notificationGroup.id,
        mockGroupSize,
      );

      expect(request.performRequestForAccount).toHaveBeenCalledWith(
        mockAtlassianCloudAccount,
        expect.stringContaining('query RetrieveNotificationsByGroupId'),
        {
          groupId: mockSingleAtlassifyNotification.notificationGroup.id,
          first: mockGroupSize,
          readState: null,
        },
      );
    });
  });

  it('getCloudIDsForHostnames - should fetch cloud ID for hostname', async () => {
    const mockHostnames = ['https://example.atlassian.net'] as Hostname[];

    await client.getCloudIDsForHostnames(
      mockAtlassianCloudAccount,
      mockHostnames,
    );

    expect(request.performRequestForAccount).toHaveBeenCalledWith(
      mockAtlassianCloudAccount,
      expect.stringContaining('query RetrieveCloudIDsForHostnames'),
      {
        hostNames: mockHostnames,
      },
    );
  });

  it('getJiraProjectTypeByKey - should fetch jira project type', async () => {
    const mockProjectKey = 'PROJ' as JiraProjectKey;
    const mockCloudID = 'mock-cloud-id' as CloudID;
    vi.spyOn(request, 'performRESTRequestForAccount').mockResolvedValueOnce({
      projectTypeKey: 'service_desk',
    } as JiraProjectRestResponse);

    const result = await client.getJiraProjectTypeByKey(
      mockAtlassianCloudAccount,
      mockCloudID,
      mockProjectKey,
    );

    expect(request.performRESTRequestForAccount).toHaveBeenCalledWith(
      `https://api.atlassian.com/ex/jira/${mockCloudID}/rest/api/3/project/${mockProjectKey}`,
      mockAtlassianCloudAccount,
    );
    expect(result).toBe('service_desk');
  });
});
