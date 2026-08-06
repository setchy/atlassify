import { act, waitFor } from '@testing-library/react';

import nock from 'nock';

import {
  configureAxiosHttpAdapterForNock,
  renderHookWithProviders,
} from '../__helpers__/test-utils';
import { mockAtlassianCloudAccount } from '../__mocks__/account-mocks';
import { mockSingleAtlassifyNotification } from '../__mocks__/notifications-mocks';

import { useSettingsStore } from '../stores';

import type { AtlassifyNotification, CloudID, Hostname, Link } from '../types';

import * as client from '../utils/api/client';
import { useNotifications } from './useNotifications';

describe('renderer/hooks/useNotifications.ts', () => {
  beforeEach(() => {
    configureAxiosHttpAdapterForNock();
  });

  describe('fetchNotifications', () => {
    it('fetchNotifications - unread only', async () => {
      nock('https://home.atlassian.com')
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
          error: null,
          hasMoreNotifications: false,
        },
      ]);
    });

    it('fetchNotifications - all notifications read/unread', async () => {
      useSettingsStore.setState({
        fetchOnlyUnreadNotifications: false,
      });

      nock('https://home.atlassian.com')
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
          error: null,
          hasMoreNotifications: false,
        },
      ]);
    });

    it('fetchNotifications - handles missing extensions response object', async () => {
      useSettingsStore.setState({
        fetchOnlyUnreadNotifications: false,
      });

      nock('https://home.atlassian.com')
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
          error: null,
          hasMoreNotifications: false,
        },
      ]);
    });
  });

  it('markNotificationsRead', async () => {
    // Mock initial fetch
    nock('https://home.atlassian.com')
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
    nock('https://home.atlassian.com').post('/gateway/api/graphql').reply(200);

    // Mock the automatic refetch after mutation
    nock('https://home.atlassian.com')
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

  it('markNotificationsRead - should scope mutation calls by hostname hint cloud ID', async () => {
    const scopedCloudId = 'cloud-scoped-id' as CloudID;
    const scopedHost = 'some-tenant.atlassian.net' as Hostname;

    const accountWithHints = {
      ...mockAtlassianCloudAccount,
      hostnameHints: [{ hostname: scopedHost, cloudId: scopedCloudId }],
    };

    const scopedNotification: AtlassifyNotification = {
      ...mockSingleAtlassifyNotification,
      account: accountWithHints,
      id: 'scoped-notification-id',
      url: 'https://some-tenant.atlassian.net/wiki/spaces/ABC/pages/123' as Link,
      notificationGroup: {
        ...mockSingleAtlassifyNotification.notificationGroup,
        size: 1,
      },
    };

    const unscopedNotification: AtlassifyNotification = {
      ...mockSingleAtlassifyNotification,
      account: accountWithHints,
      id: 'unscoped-notification-id',
      url: 'https://bitbucket.org/example/workspace/pull-requests/1' as Link,
      notificationGroup: {
        ...mockSingleAtlassifyNotification.notificationGroup,
        size: 1,
      },
    };

    // Mock initial fetch
    nock('https://home.atlassian.com')
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

    const markReadSpy = vi
      .spyOn(client, 'markNotificationsAsRead')
      .mockResolvedValue({
        data: {
          notifications: {
            markNotificationsByIdsAsRead: null,
          },
        },
      });

    const { result } = renderHookWithProviders(() => useNotifications());

    await waitFor(() => {
      expect(result.current.isFetching).toBe(false);
    });

    await act(async () => {
      await result.current.markNotificationsRead([
        scopedNotification,
        unscopedNotification,
      ]);
    });

    expect(markReadSpy).toHaveBeenCalledTimes(2);
    expect(markReadSpy).toHaveBeenNthCalledWith(
      1,
      accountWithHints,
      ['scoped-notification-id'],
      scopedCloudId,
    );
    expect(markReadSpy).toHaveBeenNthCalledWith(
      2,
      accountWithHints,
      ['unscoped-notification-id'],
      undefined,
    );
  });

  it('markNotificationsUnread - should scope mutation calls by hostname hint cloud ID', async () => {
    const scopedCloudId = 'cloud-scoped-id' as CloudID;
    const scopedHost = 'some-tenant.atlassian.net' as Hostname;

    const accountWithHints = {
      ...mockAtlassianCloudAccount,
      hostnameHints: [{ hostname: scopedHost, cloudId: scopedCloudId }],
    };

    const scopedNotification: AtlassifyNotification = {
      ...mockSingleAtlassifyNotification,
      account: accountWithHints,
      id: 'scoped-notification-id',
      url: 'https://some-tenant.atlassian.net/wiki/spaces/ABC/pages/123' as Link,
      notificationGroup: {
        ...mockSingleAtlassifyNotification.notificationGroup,
        size: 1,
      },
    };

    const unscopedNotification: AtlassifyNotification = {
      ...mockSingleAtlassifyNotification,
      account: accountWithHints,
      id: 'unscoped-notification-id',
      url: 'https://bitbucket.org/example/workspace/pull-requests/1' as Link,
      notificationGroup: {
        ...mockSingleAtlassifyNotification.notificationGroup,
        size: 1,
      },
    };

    // Mock initial fetch
    nock('https://home.atlassian.com')
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

    const markUnreadSpy = vi
      .spyOn(client, 'markNotificationsAsUnread')
      .mockResolvedValue({
        data: {
          notifications: {
            markNotificationsByIdsAsUnread: null,
          },
        },
      });

    const { result } = renderHookWithProviders(() => useNotifications());

    await waitFor(() => {
      expect(result.current.isFetching).toBe(false);
    });

    await act(async () => {
      await result.current.markNotificationsUnread([
        scopedNotification,
        unscopedNotification,
      ]);
    });

    expect(markUnreadSpy).toHaveBeenCalledTimes(2);
    expect(markUnreadSpy).toHaveBeenNthCalledWith(
      1,
      accountWithHints,
      ['scoped-notification-id'],
      scopedCloudId,
    );
    expect(markUnreadSpy).toHaveBeenNthCalledWith(
      2,
      accountWithHints,
      ['unscoped-notification-id'],
      undefined,
    );
  });

  it('markNotificationsRead - should stay unscoped when account has no hostname hints', async () => {
    const accountWithoutHints = {
      ...mockAtlassianCloudAccount,
      hostnameHints: [],
    };

    const notification: AtlassifyNotification = {
      ...mockSingleAtlassifyNotification,
      account: accountWithoutHints,
      id: 'unscoped-notification-id',
      url: 'https://jira.atlassian.com/browse/PROJECT-1' as Link,
      notificationGroup: {
        ...mockSingleAtlassifyNotification.notificationGroup,
        size: 1,
      },
    };

    // Mock initial fetch
    nock('https://home.atlassian.com')
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

    const markReadSpy = vi
      .spyOn(client, 'markNotificationsAsRead')
      .mockResolvedValue({
        data: {
          notifications: {
            markNotificationsByIdsAsRead: null,
          },
        },
      });

    const { result } = renderHookWithProviders(() => useNotifications());

    await waitFor(() => {
      expect(result.current.isFetching).toBe(false);
    });

    await act(async () => {
      await result.current.markNotificationsRead([notification]);
    });

    expect(markReadSpy).toHaveBeenCalledTimes(1);
    expect(markReadSpy).toHaveBeenCalledWith(
      accountWithoutHints,
      ['unscoped-notification-id'],
      undefined,
    );
  });

  it('markNotificationsUnread', async () => {
    // Mock initial fetch
    nock('https://home.atlassian.com')
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
    nock('https://home.atlassian.com').post('/gateway/api/graphql').reply(200);

    // Mock the automatic refetch after mutation
    nock('https://home.atlassian.com')
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
