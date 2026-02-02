import axios from 'axios';
import { vi } from 'vitest';

import { mockAtlassianCloudAccount } from '../../__mocks__/account-mocks';
import { mockSingleAtlassifyNotification } from '../../__mocks__/notifications-mocks';
import { mockSettings } from '../../__mocks__/state-mocks';

import { Constants } from '../../constants';

import type { CloudID, Hostname, JiraProjectKey } from '../../types';

import {
  checkIfCredentialsAreValid,
  getAuthenticatedUser,
  getCloudIDsForHostnames,
  getJiraProjectTypeByKey,
  getNotificationsByGroupId,
  getNotificationsForUser,
  markNotificationsAsRead,
  markNotificationsAsUnread,
} from './client';

// Experimental API tests moved to experimental/client.test.ts

vi.mock('axios');

describe('renderer/utils/api/client.ts', () => {
  beforeEach(() => {
    (axios as anyedFunction<typeof axios>).mockResolvedValue({
      data: {
        data: {},
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('checkIfCredentialsAreValid - should validate credentials', async () => {
    await checkIfCredentialsAreValid(
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
    await getAuthenticatedUser(mockAtlassianCloudAccount);

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
    await getNotificationsForUser(mockAtlassianCloudAccount, mockSettings);

    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://team.atlassian.net/gateway/api/graphql',
        method: 'POST',
        data: {
          query: expect.stringContaining('query MyNotifications'),
          variables: {
            first: Constants.MAX_NOTIFICATIONS_PER_ACCOUNT,
            flat: !mockSettings.groupNotificationsByTitle,
            readState: 'unread',
          },
        },
      }),
    );
  });

  it('markNotificationsAsRead - should mark notifications as read', async () => {
    await markNotificationsAsRead(mockAtlassianCloudAccount, [
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
    await markNotificationsAsUnread(mockAtlassianCloudAccount, [
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

      await getNotificationsByGroupId(
        mockAtlassianCloudAccount,
        { ...mockSettings, fetchOnlyUnreadNotifications: true },
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

      await getNotificationsByGroupId(
        mockAtlassianCloudAccount,
        { ...mockSettings, fetchOnlyUnreadNotifications: false },
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

    await getCloudIDsForHostnames(mockAtlassianCloudAccount, mockHostnames);

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
    (axios as anyedFunction<typeof axios>).mockResolvedValueOnce({
      data: { projectTypeKey: 'service_desk' },
    });
    const result = await getJiraProjectTypeByKey(
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
