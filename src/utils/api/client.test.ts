import axios from 'axios';
import {
  mockAtlassianCloudAccount,
  mockToken,
  mockUsername,
} from '../../__mocks__/state-mocks';
import type { SettingsState } from '../../types';
import {
  getAuthenticatedUser,
  headNotifications,
  listNotificationsForAuthenticatedUser,
  markNotificationThreadAsDone,
  markNotificationThreadAsRead,
  markRepositoryNotificationsAsRead,
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

  describe('headNotifications', () => {
    it('should fetch notifications head', async () => {
      await headNotifications(mockToken);

      expect(axios).toHaveBeenCalledWith({
        url: 'https://api.github.com/notifications',
        method: 'HEAD',
        data: {},
      });

      expect(axios.defaults.headers.common).toMatchSnapshot();
    });
  });

  describe('listNotificationsForAuthenticatedUser', () => {
    const mockSettings: Partial<SettingsState> = {
      participating: true,
    };

    it('should list notifications for user', async () => {
      await listNotificationsForAuthenticatedUser(
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

  describe('markNotificationThreadAsRead', () => {
    it('should mark notification thread as read - github', async () => {
      await markNotificationThreadAsRead(mockThreadId, mockToken);

      expect(axios).toHaveBeenCalledWith({
        url: `https://api.github.com/notifications/threads/${mockThreadId}`,
        method: 'PATCH',
        data: {},
      });

      expect(axios.defaults.headers.common).toMatchSnapshot();
    });

    it('should mark notification thread as read - enterprise', async () => {
      await markNotificationThreadAsRead(mockThreadId, mockToken);

      expect(axios).toHaveBeenCalledWith({
        url: `https://example.com/api/v3/notifications/threads/${mockThreadId}`,
        method: 'PATCH',
        data: {},
      });

      expect(axios.defaults.headers.common).toMatchSnapshot();
    });
  });

  describe('markNotificationThreadAsDone', () => {
    it('should mark notification thread as done - github', async () => {
      await markNotificationThreadAsDone(mockThreadId, mockToken);

      expect(axios).toHaveBeenCalledWith({
        url: `https://api.github.com/notifications/threads/${mockThreadId}`,
        method: 'DELETE',
        data: {},
      });

      expect(axios.defaults.headers.common).toMatchSnapshot();
    });

    it('should mark notification thread as done - enterprise', async () => {
      await markNotificationThreadAsDone(mockThreadId, mockToken);

      expect(axios).toHaveBeenCalledWith({
        url: `https://example.com/api/v3/notifications/threads/${mockThreadId}`,
        method: 'DELETE',
        data: {},
      });

      expect(axios.defaults.headers.common).toMatchSnapshot();
    });
  });

  describe('markRepositoryNotificationsAsRead', () => {
    it('should mark repository notifications as read - github', async () => {
      await markRepositoryNotificationsAsRead(mockRepoSlug, mockToken);

      expect(axios).toHaveBeenCalledWith({
        url: `https://api.github.com/repos/${mockRepoSlug}/notifications`,
        method: 'PUT',
        data: {},
      });

      expect(axios.defaults.headers.common).toMatchSnapshot();
    });
  });
});
