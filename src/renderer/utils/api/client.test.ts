import axios from 'axios';
import { vi } from 'vitest';

import { mockAtlassianCloudAccount } from '../../__mocks__/account-mocks';
import { mockSingleAtlassifyNotification } from '../../__mocks__/notifications-mocks';

import { Constants } from '../../constants';

import { DEFAULT_SETTINGS_STATE } from '../../stores/defaults';
import useSettingsStore from '../../stores/useSettingsStore';

import type { CloudID, Hostname, JiraProjectKey } from '../../types';

import * as client from './client';

// Experimental API tests moved to experimental/client.test.ts

describe('renderer/utils/api/client.ts', () => {
  beforeEach(() => {
    vi.mocked(axios).mockResolvedValue({
      data: {
        data: {},
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('checkIfCredentialsAreValid - should validate credentials', async () => {
    await client.checkIfCredentialsAreValid(
      mockAtlassianCloudAccount.username,
      mockAtlassianCloudAccount.token,
    );

    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://team.atlassian.net/gateway/api/graphql',
        method: 'POST',
        data: {
          query: expect.stringContaining('query Me'),
          variables: undefined,
        },
      }),
    );
  });

  it('getAuthenticatedUser - should fetch authenticated user details', async () => {
    await client.getAuthenticatedUser(mockAtlassianCloudAccount);

    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://team.atlassian.net/gateway/api/graphql',
        method: 'POST',
        data: {
          query: expect.stringContaining('query Me'),
          variables: undefined,
        },
      }),
    );
  });

  it('listNotificationsForAuthenticatedUser - should list notifications for user', async () => {
    await client.getNotificationsForUser(mockAtlassianCloudAccount);

    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://team.atlassian.net/gateway/api/graphql',
        method: 'POST',
        data: {
          query: expect.stringContaining('query MyNotifications'),
          variables: {
            first: Constants.MAX_NOTIFICATIONS_PER_ACCOUNT,
            flat: !DEFAULT_SETTINGS_STATE.groupNotificationsByTitle,
            readState: 'unread',
          },
        },
      }),
    );
  });

  it('markNotificationsAsRead - should mark notifications as read', async () => {
    await client.markNotificationsAsRead(mockAtlassianCloudAccount, [
      mockSingleAtlassifyNotification.id,
    ]);

    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://team.atlassian.net/gateway/api/graphql',
        method: 'POST',
        data: {
          query: expect.stringContaining('mutation MarkAsRead'),
          variables: {
            notificationIDs: [mockSingleAtlassifyNotification.id],
          },
        },
      }),
    );
  });

  it('markNotificationsAsUnread - should mark notifications as unread', async () => {
    await client.markNotificationsAsUnread(mockAtlassianCloudAccount, [
      mockSingleAtlassifyNotification.id,
    ]);

    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://team.atlassian.net/gateway/api/graphql',
        method: 'POST',
        data: {
          query: expect.stringContaining('mutation MarkAsUnread'),
          variables: {
            notificationIDs: [mockSingleAtlassifyNotification.id],
          },
        },
      }),
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

      expect(axios).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://team.atlassian.net/gateway/api/graphql',
          method: 'POST',
          data: {
            query: expect.stringContaining(
              'query RetrieveNotificationsByGroupId',
            ),
            variables: {
              groupId: mockSingleAtlassifyNotification.notificationGroup.id,
              first: mockGroupSize,
              readState: 'unread',
            },
          },
        }),
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

      expect(axios).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://team.atlassian.net/gateway/api/graphql',
          method: 'POST',
          data: {
            query: expect.stringContaining(
              'query RetrieveNotificationsByGroupId',
            ),
            variables: {
              groupId: mockSingleAtlassifyNotification.notificationGroup.id,
              first: mockGroupSize,
              readState: null,
            },
          },
        }),
      );
    });
  });

  it('getCloudIDsForHostnames - should fetch cloud ID for hostname', async () => {
    const mockHostnames = ['https://example.atlassian.net'] as Hostname[];

    await client.getCloudIDsForHostnames(
      mockAtlassianCloudAccount,
      mockHostnames,
    );

    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://team.atlassian.net/gateway/api/graphql',
        method: 'POST',
        data: {
          query: expect.stringContaining('query RetrieveCloudIDsForHostnames'),
          variables: {
            hostNames: mockHostnames,
          },
        },
      }),
    );
  });

  it('getJiraProjectTypeByKey - should fetch jira project type', async () => {
    const mockProjectKey = 'PROJ' as JiraProjectKey;
    const mockCloudID = 'mock-cloud-id' as CloudID;
    vi.mocked(axios).mockResolvedValueOnce({
      data: { projectTypeKey: 'service_desk' },
    });
    const result = await client.getJiraProjectTypeByKey(
      mockAtlassianCloudAccount,
      mockCloudID,
      mockProjectKey,
    );

    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: `https://api.atlassian.com/ex/jira/${mockCloudID}/rest/api/3/project/${mockProjectKey}`,
      }),
    );
    expect(result).toBe('service_desk');
  });
});
