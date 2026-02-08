import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import nock from 'nock';

import { configureAxiosHttpAdapterForNock } from '../__helpers__/test-utils';
import { mockSingleAtlassifyNotification } from '../__mocks__/notifications-mocks';
import { mockState } from '../__mocks__/state-mocks';

import { useNotifications } from './useNotifications';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        refetchInterval: false,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('renderer/hooks/useNotifications.ts', () => {
  beforeEach(() => {
    configureAxiosHttpAdapterForNock();
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

      const { result } = renderHook(() => useNotifications(mockState), {
        wrapper: createWrapper(),
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

      const { result } = renderHook(() => useNotifications(mockState), {
        wrapper: createWrapper(),
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

      const { result } = renderHook(() => useNotifications(mockState), {
        wrapper: createWrapper(),
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
    // Mock initial fetch
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

    // Mock the markNotificationsAsRead mutation
    nock('https://team.atlassian.net').post('/gateway/api/graphql').reply(200);

    // Mock the automatic refetch after mutation
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

    const { result } = renderHook(() => useNotifications(mockState), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.status).toBe('success');
    });

    await act(async () => {
      await result.current.markNotificationsRead(mockState, [
        mockSingleAtlassifyNotification,
      ]);
    });

    await waitFor(() => {
      expect(result.current.status).toBe('success');
    });

    expect(result.current.notifications.length).toBe(1);
  });

  it('markNotificationsUnread', async () => {
    // Mock initial fetch
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

    // Mock the markNotificationsAsUnread mutation
    nock('https://team.atlassian.net').post('/gateway/api/graphql').reply(200);

    // Mock the automatic refetch after mutation
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

    const { result } = renderHook(() => useNotifications(mockState), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.status).toBe('success');
    });

    await act(async () => {
      await result.current.markNotificationsUnread(mockState, [
        mockSingleAtlassifyNotification,
      ]);
    });

    await waitFor(() => {
      expect(result.current.status).toBe('success');
    });

    expect(result.current.notifications.length).toBe(1);
  });
});
