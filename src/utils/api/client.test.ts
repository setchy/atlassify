import axios from 'axios';
import {
  mockAtlassianCloudAccount,
  mockSettings,
  mockToken,
  mockUsername,
} from '../../__mocks__/state-mocks';
import type { SettingsState } from '../../types';
import {
  getAuthenticatedUser,
  getNotificationsForUser,
  markNotificationsAsRead,
  markNotificationsAsUnread,
} from './client';

jest.mock('axios');

const mockThreadId = '1234';
const mockRepoSlug = 'atlasify-app/notifications-test';

describe('utils/api/client.ts', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAuthenticatedUser', () => {
    it('should fetch authenticated user - github', async () => {
      await getAuthenticatedUser(mockUsername, mockToken);

      expect(axios).toHaveBeenCalledWith({
        url: 'https://api.github.com/user',
        method: 'GET',
        data: {},
      });

      expect(axios.defaults.headers.common).toMatchSnapshot();
    });
  });

  describe('listNotificationsForAuthenticatedUser', () => {
    it('should list notifications for user', async () => {
      await getNotificationsForUser(
        mockAtlassianCloudAccount,
        mockSettings as SettingsState,
      );

      expect(axios).toHaveBeenCalledWith({
        url: 'https://api.github.com/notifications?participating=true',
        method: 'GET',
        data: {},
      });

      expect(axios.defaults.headers.common).toMatchSnapshot();
    });
  });

  describe('markNotificationsAsRead', () => {
    it('should mark notifications as read', async () => {
      await markNotificationsAsRead(mockAtlassianCloudAccount, [mockThreadId]);

      expect(axios).toHaveBeenCalledWith({
        url: `https://api.github.com/notifications/threads/${mockThreadId}`,
        method: 'PATCH',
        data: {},
      });

      expect(axios.defaults.headers.common).toMatchSnapshot();
    });
  });

  describe('markNotificationsAsUnread', () => {
    it('should mark repository notifications as read - github', async () => {
      await markNotificationsAsUnread(mockAtlassianCloudAccount, [
        mockThreadId,
      ]);

      expect(axios).toHaveBeenCalledWith({
        url: `https://api.github.com/repos/${mockRepoSlug}/notifications`,
        method: 'PUT',
        data: {},
      });

      expect(axios.defaults.headers.common).toMatchSnapshot();
    });
  });
});
