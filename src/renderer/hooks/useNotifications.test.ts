import { act, renderHook, waitFor } from '@testing-library/react';

import axios from 'axios';
import nock from 'nock';

import { mockSingleAtlassifyNotification } from '../__mocks__/notifications-mocks';
import { mockState } from '../__mocks__/state-mocks';
import { useNotifications } from './useNotifications';

describe('renderer/hooks/useNotifications.ts', () => {
  beforeEach(() => {
    // axios will default to using the XHR adapter which can't be intercepted
    // by nock. So, configure axios to use the node adapter.
    axios.defaults.adapter = 'http';
  });

  describe('fetchNotifications', () => {
    it('fetchNotifications - unread only', async () => {
      nock('https://team.atlassian.net')
        .post('/gateway/api/graphql')
        .reply(200, {
          data: {
            notifications: {
              notificationFeed: {
                nodes: [],
              },
            },
          },
          extensions: {
            notifications: {
              response_info: {
                responseSize: 0,
              },
            },
          },
        });

      const { result } = renderHook(() => useNotifications());

      act(() => {
        result.current.fetchNotifications(mockState);
      });

      await waitFor(() => {
        expect(result.current.status).toBe('success');
      });

      expect(result.current.notifications).toEqual([
        {
          account: mockState.auth.accounts[0],
          notifications: [],
          error: null,
          hasMoreNotifications: false,
        },
      ]);
    });

    it('fetchNotifications - all notifications read/unread', async () => {
      mockState.settings.fetchOnlyUnreadNotifications = false;

      nock('https://team.atlassian.net')
        .post('/gateway/api/graphql')
        .reply(200, {
          data: {
            notifications: {
              notificationFeed: {
                nodes: [],
              },
            },
          },
          extensions: {
            notifications: {
              response_info: {
                responseSize: 0,
              },
            },
          },
        });

      const { result } = renderHook(() => useNotifications());

      act(() => {
        result.current.fetchNotifications(mockState);
      });

      await waitFor(() => {
        expect(result.current.status).toBe('success');
      });

      expect(result.current.notifications).toEqual([
        {
          account: mockState.auth.accounts[0],
          notifications: [],
          error: null,
          hasMoreNotifications: false,
        },
      ]);
    });

    it('fetchNotifications - handles missing extensions response object', async () => {
      mockState.settings.fetchOnlyUnreadNotifications = false;

      nock('https://team.atlassian.net')
        .post('/gateway/api/graphql')
        .reply(200, {
          data: {
            notifications: {
              notificationFeed: {
                nodes: [],
              },
            },
          },
        });

      const { result } = renderHook(() => useNotifications());

      act(() => {
        result.current.fetchNotifications(mockState);
      });

      await waitFor(() => {
        expect(result.current.status).toBe('success');
      });

      expect(result.current.notifications).toEqual([
        {
          account: mockState.auth.accounts[0],
          notifications: [],
          error: null,
          hasMoreNotifications: false,
        },
      ]);
    });
  });

  it('markNotificationsRead', async () => {
    nock('https://team.atlassian.net').post('/gateway/api/graphql').reply(200);

    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.markNotificationsRead(mockState, [
        mockSingleAtlassifyNotification,
      ]);
    });

    await waitFor(() => {
      expect(result.current.status).toBe('success');
    });

    expect(result.current.notifications.length).toBe(0);
  });

  it('markNotificationsUnread', async () => {
    nock('https://team.atlassian.net').post('/gateway/api/graphql').reply(200);

    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.markNotificationsUnread(mockState, [
        mockSingleAtlassifyNotification,
      ]);
    });

    await waitFor(() => {
      expect(result.current.status).toBe('success');
    });

    expect(result.current.notifications.length).toBe(0);
  });
});
