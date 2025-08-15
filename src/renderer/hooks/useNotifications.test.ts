import { act, renderHook, waitFor } from '@testing-library/react';

import axios from 'axios';

jest.mock('axios');

import { mockSingleAtlassifyNotification } from '../__mocks__/notifications-mocks';
import { mockState } from '../__mocks__/state-mocks';
import { useNotifications } from './useNotifications';

describe('renderer/hooks/useNotifications.ts', () => {
  const mockedAxios = axios as unknown as jest.MockedFunction<typeof axios>;

  // Helper to build a typed AxiosResponse without unsafe `as never` casts everywhere.
  function mockAxiosResponse<T>(payload: T) {
    return {
      data: payload,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    } as import('axios').AxiosResponse<T>;
  }

  afterEach(() => {
    mockedAxios.mockReset();
  });

  describe('fetchNotifications', () => {
    it('fetchNotifications - unread only', async () => {
      mockedAxios.mockResolvedValueOnce(
        mockAxiosResponse({
          data: {
            notifications: {
              notificationFeed: {
                pageInfo: { hasNextPage: false },
                nodes: [],
              },
            },
          },
          extensions: {
            notifications: { response_info: { responseSize: 0 } },
          },
        }),
      );

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

      mockedAxios.mockResolvedValueOnce(
        mockAxiosResponse({
          data: {
            notifications: {
              notificationFeed: {
                pageInfo: { hasNextPage: false },
                nodes: [],
              },
            },
          },
          extensions: {
            notifications: { response_info: { responseSize: 0 } },
          },
        }),
      );

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

      mockedAxios.mockResolvedValueOnce(
        mockAxiosResponse({
          data: {
            notifications: {
              notificationFeed: {
                pageInfo: { hasNextPage: false },
                nodes: [],
              },
            },
          },
        }),
      );

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
    mockedAxios.mockResolvedValueOnce(mockAxiosResponse({ data: {} }));

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
    mockedAxios.mockResolvedValueOnce(mockAxiosResponse({ data: {} }));

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
