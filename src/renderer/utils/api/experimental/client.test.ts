import { vi } from 'vitest';

import { mockAtlassianCloudAccount } from '../../../__mocks__/account-mocks';
import { mockSingleAtlassifyNotification } from '../../../__mocks__/notifications-mocks';

import type { CloudID, JiraProjectKey } from '../../../types';

import * as request from '../request';
import * as client from './client';

describe('renderer/utils/api/experimental/client.ts', () => {
  beforeEach(() => {
    vi.spyOn(request, 'performRequestForAccount').mockResolvedValue({
      data: {
        data: {},
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('markNotificationGroupAsRead - should mark notification group as read', async () => {
    await client.markNotificationGroupAsRead(
      mockAtlassianCloudAccount,
      mockSingleAtlassifyNotification.notificationGroup.id,
    );

    expect(request.performRequestForAccount).toHaveBeenCalledWith(
      mockAtlassianCloudAccount,
      expect.stringContaining('mutation MarkGroupAsRead'),
      {
        groupId: mockSingleAtlassifyNotification.notificationGroup.id,
      },
    );
  });

  it('markNotificationGroupAsUnread - should mark notification group as unread', async () => {
    await client.markNotificationGroupAsUnread(
      mockAtlassianCloudAccount,
      mockSingleAtlassifyNotification.notificationGroup.id,
    );

    expect(request.performRequestForAccount).toHaveBeenCalledWith(
      mockAtlassianCloudAccount,
      expect.stringContaining('mutation MarkGroupAsUnread'),
      {
        groupId: mockSingleAtlassifyNotification.notificationGroup.id,
      },
    );
  });

  it('getJiraProjectTypesByKeys - should fetch project types by keys', async () => {
    const mockProjectKeys = ['PROJ-1', 'PROJ-2'] as JiraProjectKey[];
    const mockCloudID = 'mock-cloud-id' as CloudID;
    await client.getJiraProjectTypesByKeys(
      mockAtlassianCloudAccount,
      mockCloudID,
      mockProjectKeys,
    );

    expect(request.performRequestForAccount).toHaveBeenCalledWith(
      mockAtlassianCloudAccount,
      expect.stringContaining('query RetrieveJiraProjectTypes'),
      {
        cloudId: mockCloudID,
        keys: mockProjectKeys,
      },
    );
  });
});
