import { group } from 'console';

import { act, waitFor } from '@testing-library/react';

import nock from 'nock';

import {
  configureAxiosHttpAdapterForNock,
  renderHookWithProviders,
} from '../__helpers__/test-utils';
import { mockAtlassianCloudAccount } from '../__mocks__/account-mocks';
import { mockSingleAtlassifyNotification } from '../__mocks__/notifications-mocks';

import { useSettingsStore } from '../stores';

import type { AtlassifyNotification, ProductType } from '../types';

import { useNotifications } from './useNotifications';

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

      const { result } = renderHookWithProviders(() => useNotifications());

      await waitFor(() => {
        expect(result.current.isFetching).toBe(false);
      });

      expect(result.current.notifications).toEqual([
        {
          account: mockAtlassianCloudAccount,
          notifications: [],
          groupedNotifications: {} as Record<
            ProductType,
            AtlassifyNotification[]
          >,
          error: null,
          hasMoreNotifications: false,
        },
      ]);
    });

    it('fetchNotifications - all notifications read/unread', async () => {
      useSettingsStore.setState({
        fetchOnlyUnreadNotifications: false,
      });

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

      const { result } = renderHookWithProviders(() => useNotifications());

      await waitFor(() => {
        expect(result.current.isFetching).toBe(false);
      });

      expect(result.current.notifications).toEqual([
        {
          account: mockAtlassianCloudAccount,
          notifications: [],
          groupedNotifications: {} as Record<
            ProductType,
            AtlassifyNotification[]
          >,
          error: null,
          hasMoreNotifications: false,
        },
      ]);
    });

    it('fetchNotifications - handles missing extensions response object', async () => {
      useSettingsStore.setState({
        fetchOnlyUnreadNotifications: false,
      });

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

      const { result } = renderHookWithProviders(() => useNotifications());

      await waitFor(() => {
        expect(result.current.isFetching).toBe(false);
      });

      expect(result.current.notifications).toEqual([
        {
          account: mockAtlassianCloudAccount,
          notifications: [],
          groupedNotifications: {} as Record<
            ProductType,
            AtlassifyNotification[]
          >,
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

    const { result } = renderHookWithProviders(() => useNotifications());

    await waitFor(() => {
      expect(result.current.isFetching).toBe(false);
    });

    await act(async () => {
      await result.current.markNotificationsRead([
        mockSingleAtlassifyNotification,
      ]);
    });

    await waitFor(() => {
      expect(result.current.isFetching).toBe(false);
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

    const { result } = renderHookWithProviders(() => useNotifications());

    await waitFor(() => {
      expect(result.current.isFetching).toBe(false);
    });

    await act(async () => {
      await result.current.markNotificationsUnread([
        mockSingleAtlassifyNotification,
      ]);
    });

    await waitFor(() => {
      expect(result.current.isFetching).toBe(false);
    });

    expect(result.current.notifications.length).toBe(1);
  });
});
