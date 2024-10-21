import axios from 'axios';
import { mockSingleAtlassifyNotification } from '../../__mocks__/notifications-mocks';
import {
  mockAtlassianCloudAccount,
  mockSettings,
} from '../../__mocks__/state-mocks';
import { Constants } from '../constants';
import {
  checkIfCredentialsAreValid,
  getAuthenticatedUser,
  getNotificationsForUser,
  markNotificationsAsRead,
  markNotificationsAsUnread,
} from './client';

jest.mock('axios');

describe('renderer/utils/api/client.ts', () => {
  beforeEach(() => {
    // TODO: add more explicit mocks
    (axios as jest.MockedFunction<typeof axios>).mockResolvedValue({
      data: {
        data: {},
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('checkIfCredentialsAreValid - should validate credentials', async () => {
    await checkIfCredentialsAreValid(
      mockAtlassianCloudAccount.username,
      mockAtlassianCloudAccount.token,
    );

    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://team.atlassian.net/gateway/api/graphql',
        method: 'HEAD',
        data: {},
      }),
    );

    expect(axios.defaults.headers.common).toMatchSnapshot();
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

    expect(axios.defaults.headers.common).toMatchSnapshot();
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
            readState: 'unread',
          },
        },
      }),
    );

    expect(axios.defaults.headers.common).toMatchSnapshot();
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

    expect(axios.defaults.headers.common).toMatchSnapshot();
  });

  it('markNotificationsAsUnread - should mark repository notifications as read - github', async () => {
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

    expect(axios.defaults.headers.common).toMatchSnapshot();
  });
});
