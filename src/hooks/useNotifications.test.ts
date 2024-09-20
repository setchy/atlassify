import { act, renderHook, waitFor } from '@testing-library/react';
import axios, { AxiosError } from 'axios';
import nock from 'nock';

import log from 'electron-log';
import { mockSingleNotification } from '../__mocks__/notifications-mocks';
import { mockAuth, mockSettings, mockState } from '../__mocks__/state-mocks';
import { Errors } from '../utils/errors';
import { useNotifications } from './useNotifications';

describe('hooks/useNotifications.ts', () => {
  const logErrorSpy = jest.spyOn(log, 'error').mockImplementation();

  beforeEach(() => {
    // axios will default to using the XHR adapter which can't be intercepted
    // by nock. So, configure axios to use the node adapter.
    axios.defaults.adapter = 'http';
    logErrorSpy.mockReset();
  });

  const id = mockSingleNotification.id;

  describe.skip('fetchNotifications', () => {
    it('should fetch notifications with success', async () => {
      const mockState = {
        auth: mockAuth,
        settings: {
          ...mockSettings,
          detailedNotifications: false,
        },
      };

      nock('https://team.atlassian.net')
        .post('/gateway/api/graphql')
        .reply(200, {
          data: {
            notifications: {
              notificationFeed: {
                nodes: [
                  {
                    headNotification: {
                      notificationId: 1,
                      title: 'This is a notification.',
                    },
                  },
                  {
                    headNotification: {
                      notificationId: 2,
                      title: 'This is another notification.',
                    },
                  },
                ],
              },
            },
          },
        });

      const { result } = renderHook(() => useNotifications());

      act(() => {
        result.current.fetchNotifications(mockState);
      });

      expect(result.current.status).toBe('loading');

      await waitFor(() => {
        expect(result.current.status).toBe('success');
      });

      expect(result.current.notifications[0].notifications.length).toBe(2);
    });

    it('should fetch notifications with same failures', async () => {
      const code = AxiosError.ERR_BAD_REQUEST;
      const status = 401;
      const message = 'Bad credentials';

      nock('https://api.github.com/')
        .get('/notifications?participating=false')
        .replyWithError({
          code,
          response: {
            status,
            data: {
              message,
            },
          },
        });

      nock('https://github.atlassify.io/api/v3/')
        .get('/notifications?participating=false')
        .replyWithError({
          code,
          response: {
            status,
            data: {
              message,
            },
          },
        });

      const { result } = renderHook(() => useNotifications());

      act(() => {
        result.current.fetchNotifications(mockState);
      });

      expect(result.current.status).toBe('loading');

      await waitFor(() => {
        expect(result.current.status).toBe('error');
      });

      expect(result.current.globalError).toBe(Errors.BAD_CREDENTIALS);
      expect(logErrorSpy).toHaveBeenCalledTimes(2);
    });

    it('should fetch notifications with different failures', async () => {
      const code = AxiosError.ERR_BAD_REQUEST;

      nock('https://api.github.com/')
        .get('/notifications?participating=false')
        .replyWithError({
          code,
          response: {
            status: 400,
            data: {
              message: 'Oops! Something went wrong.',
            },
          },
        });

      nock('https://github.atlassify.io/api/v3/')
        .get('/notifications?participating=false')
        .replyWithError({
          code,
          response: {
            status: 401,
            data: {
              message: 'Bad credentials',
            },
          },
        });

      const { result } = renderHook(() => useNotifications());

      act(() => {
        result.current.fetchNotifications(mockState);
      });

      expect(result.current.status).toBe('loading');

      await waitFor(() => {
        expect(result.current.status).toBe('error');
      });

      expect(result.current.globalError).toBeNull();
      expect(logErrorSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe.skip('markNotificationsRead', () => {
    it('should mark a notifications as read with success', async () => {
      nock('https://api.github.com/')
        .patch(`/notifications/threads/${id}`)
        .reply(200);

      const { result } = renderHook(() => useNotifications());

      act(() => {
        result.current.markNotificationsRead(mockState, [
          mockSingleNotification,
        ]);
      });

      await waitFor(() => {
        expect(result.current.status).toBe('success');
      });

      expect(result.current.notifications.length).toBe(0);
    });

    it('should mark a notifications as read with failure', async () => {
      nock('https://api.github.com/')
        .patch(`/notifications/threads/${id}`)
        .reply(400);

      const { result } = renderHook(() => useNotifications());

      act(() => {
        result.current.markNotificationsRead(mockState, [
          mockSingleNotification,
        ]);
      });

      await waitFor(() => {
        expect(result.current.status).toBe('success');
      });

      expect(result.current.notifications.length).toBe(0);
      expect(logErrorSpy).toHaveBeenCalledTimes(1);
    });
  });
});
