import axios from 'axios';

import { mockSingleAtlassifyNotification } from '../../../__mocks__/notifications-mocks';
import { mockAtlassianCloudAccount } from '../../../__mocks__/state-mocks';
import type { CloudID, JiraProjectKey } from '../../../types';
import {
  getJiraProjectTypesByKeys,
  markNotificationGroupAsRead,
  markNotificationGroupAsUnread,
} from './client';

jest.mock('axios');

describe('renderer/utils/api/experimental/client.ts', () => {
  beforeEach(() => {
    (axios as jest.MockedFunction<typeof axios>).mockResolvedValue({
      data: {
        data: {},
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('markNotificationGroupAsRead - should mark notification group as read', async () => {
    await markNotificationGroupAsRead(
      mockAtlassianCloudAccount,
      mockSingleAtlassifyNotification.notificationGroup.id,
    );

    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://team.atlassian.net/gateway/api/graphql',
        method: 'POST',
        data: {
          query: expect.stringContaining('mutation MarkGroupAsRead'),
          variables: {
            groupId: mockSingleAtlassifyNotification.notificationGroup.id,
          },
        },
      }),
    );
  });

  it('markNotificationGroupAsUnread - should mark notification group as unread', async () => {
    await markNotificationGroupAsUnread(
      mockAtlassianCloudAccount,
      mockSingleAtlassifyNotification.notificationGroup.id,
    );

    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://team.atlassian.net/gateway/api/graphql',
        method: 'POST',
        data: {
          query: expect.stringContaining('mutation MarkGroupAsUnread'),
          variables: {
            groupId: mockSingleAtlassifyNotification.notificationGroup.id,
          },
        },
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

    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://team.atlassian.net/gateway/api/graphql',
        method: 'POST',
        data: {
          query: expect.stringContaining('query RetrieveJiraProjectTypes'),
          variables: {
            cloudId: mockCloudID,
            keys: mockProjectKeys,
          },
        },
      }),
    );
  });
});
