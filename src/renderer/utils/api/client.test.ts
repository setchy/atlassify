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
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('checkIfCredentialsAreValid', () => {
    it('should validate credentials', async () => {
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
  });

  describe('getAuthenticatedUser', () => {
    it('should fetch authenticated user details', async () => {
      await getAuthenticatedUser(mockAtlassianCloudAccount);

      expect(axios).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://team.atlassian.net/gateway/api/graphql',
          method: 'POST',
          data: {
            query: expect.stringContaining('query me'),
            variables: {},
          },
        }),
      );

      expect(axios.defaults.headers.common).toMatchSnapshot();
    });
  });

  describe('listNotificationsForAuthenticatedUser', () => {
    it('should list notifications for user', async () => {
      await getNotificationsForUser(mockAtlassianCloudAccount, mockSettings);

      expect(axios).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://team.atlassian.net/gateway/api/graphql',
          method: 'POST',
          data: {
            query: expect.stringContaining('query myNotifications'),
            variables: {
              first: Constants.MAX_NOTIFICATIONS_PER_ACCOUNT,
              readState: 'unread',
            },
          },
        }),
      );

      expect(axios.defaults.headers.common).toMatchSnapshot();
    });
  });

  describe('markNotificationsAsRead', () => {
    it('should mark notifications as read', async () => {
      await markNotificationsAsRead(mockAtlassianCloudAccount, [
        mockSingleAtlassifyNotification.id,
      ]);

      expect(axios).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://team.atlassian.net/gateway/api/graphql',
          method: 'POST',
          data: {
            query: expect.stringContaining('mutation markAsRead'),
            variables: {
              notificationIDs: [mockSingleAtlassifyNotification.id],
            },
          },
        }),
      );

      expect(axios.defaults.headers.common).toMatchSnapshot();
    });
  });

  describe('markNotificationsAsUnread', () => {
    it('should mark repository notifications as read - github', async () => {
      await markNotificationsAsUnread(mockAtlassianCloudAccount, [
        mockSingleAtlassifyNotification.id,
      ]);

      expect(axios).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://team.atlassian.net/gateway/api/graphql',
          method: 'POST',
          data: {
            query: expect.stringContaining('mutation markAsUnread'),
            variables: {
              notificationIDs: [mockSingleAtlassifyNotification.id],
            },
          },
        }),
      );

      expect(axios.defaults.headers.common).toMatchSnapshot();
    });
  });
});
