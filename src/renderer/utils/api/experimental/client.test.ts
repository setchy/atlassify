import { mockSingleAtlassifyNotification } from '../../../__mocks__/notifications-mocks';
import { mockAtlassianCloudAccount } from '../../../__mocks__/state-mocks';
import type { CloudID, JiraProjectKey } from '../../../types';
import {
  getJiraProjectTypesByKeys,
  markNotificationGroupAsRead,
  markNotificationGroupAsUnread,
} from './client';

const originalFetch = globalThis.fetch;

describe('renderer/utils/api/experimental/client.ts', () => {
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

  it('markNotificationGroupAsRead - should mark notification group as read', async () => {
    await markNotificationGroupAsRead(
      mockAtlassianCloudAccount,
      mockSingleAtlassifyNotification.notificationGroup.id,
    );

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://team.atlassian.net/gateway/api/graphql',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('mutation MarkGroupAsRead'),
      }),
    );
  });

  it('markNotificationGroupAsUnread - should mark notification group as unread', async () => {
    await markNotificationGroupAsUnread(
      mockAtlassianCloudAccount,
      mockSingleAtlassifyNotification.notificationGroup.id,
    );

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://team.atlassian.net/gateway/api/graphql',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('mutation MarkGroupAsUnread'),
      }),
    );
  });

  it('getJiraProjectTypesByKeys - should fetch project types by keys', async () => {
    const mockProjectKeys = ['PROJ-1', 'PROJ-2'] as JiraProjectKey[];
    const mockCloudID = 'mock-cloud-id' as CloudID;
    await getJiraProjectTypesByKeys(
      mockAtlassianCloudAccount,
      mockCloudID,
      mockProjectKeys,
    );

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://team.atlassian.net/gateway/api/graphql',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('query RetrieveJiraProjectTypes'),
      }),
    );
  });
});
