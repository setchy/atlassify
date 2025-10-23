import { mockSingleAtlassifyNotification } from '../../__mocks__/notifications-mocks';
import {
  mockAtlassianCloudAccount,
  mockSettings,
} from '../../__mocks__/state-mocks';
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

const originalFetch = globalThis.fetch;

describe('renderer/utils/api/client.ts', () => {
  beforeEach(() => {
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ data: {} }),
    } as unknown as Response);
  });

  afterEach(() => {
    jest.clearAllMocks();
    globalThis.fetch = originalFetch;
  });

  it('checkIfCredentialsAreValid - should validate credentials', async () => {
    await checkIfCredentialsAreValid(
      mockAtlassianCloudAccount.username,
      mockAtlassianCloudAccount.token,
    );

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://team.atlassian.net/gateway/api/graphql',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('query Me'),
      }),
    );
  });

  it('getAuthenticatedUser - should fetch authenticated user details', async () => {
    await getAuthenticatedUser(mockAtlassianCloudAccount);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://team.atlassian.net/gateway/api/graphql',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('query Me'),
      }),
    );
  });

  it('listNotificationsForAuthenticatedUser - should list notifications for user', async () => {
    await getNotificationsForUser(mockAtlassianCloudAccount, mockSettings);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://team.atlassian.net/gateway/api/graphql',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('query MyNotifications'),
      }),
    );
  });

  it('markNotificationsAsRead - should mark notifications as read', async () => {
    await markNotificationsAsRead(mockAtlassianCloudAccount, [
      mockSingleAtlassifyNotification.id,
    ]);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://team.atlassian.net/gateway/api/graphql',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('mutation MarkAsRead'),
      }),
    );
  });

  it('markNotificationsAsUnread - should mark notifications as unread', async () => {
    await markNotificationsAsUnread(mockAtlassianCloudAccount, [
      mockSingleAtlassifyNotification.id,
    ]);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://team.atlassian.net/gateway/api/graphql',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('mutation MarkAsUnread'),
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

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://team.atlassian.net/gateway/api/graphql',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('query RetrieveNotificationsByGroupId'),
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

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://team.atlassian.net/gateway/api/graphql',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('query RetrieveNotificationsByGroupId'),
        }),
      );
    });
  });

  it('getCloudIDsForHostnames - should fetch cloud ID for hostname', async () => {
    const mockHostnames = ['https://example.atlassian.net'] as Hostname[];

    await getCloudIDsForHostnames(mockAtlassianCloudAccount, mockHostnames);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://team.atlassian.net/gateway/api/graphql',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('query RetrieveCloudIDsForHostnames'),
      }),
    );
  });

  it('getJiraProjectTypeByKey - should fetch jira project type', async () => {
    const mockProjectKey = 'PROJ' as JiraProjectKey;
    const mockCloudID = 'mock-cloud-id' as CloudID;
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ projectTypeKey: 'service_desk' }),
    } as unknown as Response);
    const result = await getJiraProjectTypeByKey(
      mockAtlassianCloudAccount,
      mockCloudID,
      mockProjectKey,
    );

    expect(globalThis.fetch).toHaveBeenCalledWith(
      `https://api.atlassian.com/ex/jira/${mockCloudID}/rest/api/3/project/${mockProjectKey}`,
      expect.objectContaining({ method: 'GET' }),
    );
    expect(result).toBe('service_desk');
  });
});
