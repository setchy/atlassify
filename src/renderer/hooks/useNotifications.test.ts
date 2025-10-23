import { act, renderHook, waitFor } from '@testing-library/react';

import { mockSingleAtlassifyNotification } from '../__mocks__/notifications-mocks';
import { mockState } from '../__mocks__/state-mocks';
import { useNotifications } from './useNotifications';

describe('renderer/hooks/useNotifications.ts', () => {
  const originalFetch = globalThis.fetch;
  afterEach(() => {
    jest.clearAllMocks();
    globalThis.fetch = originalFetch;
  });
  beforeEach(() => {});

  describe('fetchNotifications', () => {
    it('fetchNotifications - unread only', async () => {
      globalThis.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
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
        }),
      } as unknown as Response);

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

      globalThis.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
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
        }),
      } as unknown as Response);

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

      globalThis.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          data: {
            notifications: {
              notificationFeed: {
                nodes: [],
              },
            },
          },
        }),
      } as unknown as Response);

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
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({}),
    } as unknown as Response);

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
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({}),
    } as unknown as Response);

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
