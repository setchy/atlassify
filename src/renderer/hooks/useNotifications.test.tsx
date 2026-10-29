import { act, waitFor } from '@testing-library/react';

import { onlineManager } from '@tanstack/react-query';
import type { MockInstance } from 'vitest';

import { renderHookWithProviders } from '../__helpers__/test-utils';
import {
  mockAtlassianCloudAccount,
  mockAtlassianCloudAccountTwo,
} from '../__mocks__/account-mocks';
import { mockSingleAtlassifyNotification } from '../__mocks__/notifications-mocks';

import { Constants } from '../constants';

import {
  getNotificationFailureKey,
  useAccountsStore,
  useFiltersStore,
  useNotificationActionFailuresStore,
  useSettingsStore,
} from '../stores';

import type {
  AccountNotifications,
  AtlassifyNotification,
  CloudID,
  Hostname,
  Link,
} from '../types';

import * as client from '../utils/api/client';
import { Errors } from '../utils/core/errors';
import { useNotifications } from './useNotifications';

const emptyNotificationsResponse = {
  data: { notifications: { notificationFeed: { nodes: [] } } },
  extensions: { notifications: { response_info: { responseSize: 0 } } },
} as Awaited<ReturnType<typeof client.getNotificationsForUser>>;

let getNotificationsSpy: MockInstance<typeof client.getNotificationsForUser>;

function mockNotificationsResponse(
  response = emptyNotificationsResponse,
  delayMs = 0,
) {
  getNotificationsSpy.mockImplementationOnce(
    () =>
      new Promise((resolve) => setTimeout(() => resolve(response), delayMs)),
  );
}

function mockNotificationsError(delayMs = 0) {
  getNotificationsSpy.mockImplementationOnce(
    () =>
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request failed')), delayMs),
      ),
  );
}

describe('renderer/hooks/useNotifications.ts', () => {
  beforeEach(() => {
    onlineManager.setOnline(true);
    getNotificationsSpy = vi
      .spyOn(client, 'getNotificationsForUser')
      .mockRejectedValue(new Error('Unexpected request'));
  });

  afterEach(() => {
    onlineManager.setOnline(true);
    vi.restoreAllMocks();
  });

  describe('fetchNotifications', () => {
    it('refetches when an account is replaced without changing the account count', async () => {
      mockNotificationsResponse();
      mockNotificationsResponse();

      const { result } = renderHookWithProviders(() => useNotifications());

      await waitFor(() => expect(getNotificationsSpy).toHaveBeenCalledTimes(1));

      act(() => {
        useAccountsStore.setState({ accounts: [mockAtlassianCloudAccountTwo] });
      });

      await waitFor(() => expect(getNotificationsSpy).toHaveBeenCalledTimes(2));
      await waitFor(() =>
        expect(result.current.notifications[0]?.account.id).toBe(
          mockAtlassianCloudAccountTwo.id,
        ),
      );
    });

    it('shows loading after login when the signed-out result was empty', async () => {
      useAccountsStore.setState({ accounts: [] });

      const { result } = renderHookWithProviders(() => useNotifications());
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      mockNotificationsResponse(emptyNotificationsResponse, 50);

      act(() => {
        useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });
      });

      await waitFor(() => expect(result.current.isLoading).toBe(true));
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.notifications).toEqual([
        {
          account: mockAtlassianCloudAccount,
          notifications: [],
          error: null,
          hasMoreNotifications: false,
        },
      ]);
    });

    it('shows loading when the account set changes from an empty settled inbox', async () => {
      mockNotificationsResponse();

      const { result } = renderHookWithProviders(() => useNotifications());
      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(result.current.notifications).toHaveLength(1);
      expect(result.current.notifications[0].notifications).toEqual([]);

      mockNotificationsResponse(emptyNotificationsResponse, 50);
      mockNotificationsResponse(emptyNotificationsResponse, 50);

      act(() => {
        useAccountsStore.setState({
          accounts: [mockAtlassianCloudAccount, mockAtlassianCloudAccountTwo],
        });
      });

      await waitFor(() => expect(result.current.isLoading).toBe(true));
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.notifications).toHaveLength(2);
    });

    it('uses the notification polling cadence for stale and refetch intervals', async () => {
      mockNotificationsResponse();

      const { queryClient, result, unmount } = renderHookWithProviders(() =>
        useNotifications(),
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      const query = queryClient.getQueryCache().getAll()[0];
      const observerOptions = query.observers[0].options;

      expect(observerOptions.staleTime).toBe(
        Constants.FETCH_NOTIFICATIONS_INTERVAL_MS,
      );
      expect(observerOptions.refetchInterval).toBe(
        Constants.FETCH_NOTIFICATIONS_INTERVAL_MS,
      );

      unmount();
      queryClient.clear();
    });

    it('keeps settled data out of loading state during a background refetch', async () => {
      mockNotificationsResponse();
      mockNotificationsError(50);

      const { queryClient, result, unmount } = renderHookWithProviders(() =>
        useNotifications(),
      );
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      let refetchPromise!: Promise<void>;
      act(() => {
        refetchPromise = result.current.refetchNotifications();
      });

      await waitFor(() => expect(result.current.isFetching).toBe(true));
      expect(result.current.isLoading).toBe(false);
      expect(result.current.notifications).toHaveLength(1);

      await act(async () => {
        await refetchPromise;
      });

      unmount();
      queryClient.clear();
    });

    it('removes its system wake listener on unmount', () => {
      const unsubscribe = vi.fn();
      vi.mocked(window.atlassify.onSystemWake).mockReturnValueOnce(unsubscribe);

      const { unmount } = renderHookWithProviders(() => useNotifications());
      unmount();

      expect(unsubscribe).toHaveBeenCalledOnce();
    });

    it('does not refetch when a display-only filter changes', async () => {
      mockNotificationsResponse();

      renderHookWithProviders(() => useNotifications());

      await waitFor(() => expect(getNotificationsSpy).toHaveBeenCalledTimes(1));

      act(() => {
        useFiltersStore.setState({ engagementStates: ['mention'] });
      });

      expect(getNotificationsSpy).toHaveBeenCalledTimes(1);
    });

    it('fetchNotifications - unread only', async () => {
      mockNotificationsResponse();

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

      mockNotificationsResponse();

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

      mockNotificationsResponse({
        data: emptyNotificationsResponse.data,
      } as typeof emptyNotificationsResponse);

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

    it('reports an offline pause without starting a request', async () => {
      onlineManager.setOnline(false);

      const { queryClient, result, unmount } = renderHookWithProviders(() =>
        useNotifications(),
      );

      await waitFor(() => expect(result.current.isErrorOrPaused).toBe(true));
      expect(result.current.globalError).toEqual(Errors.OFFLINE);
      expect(getNotificationsSpy).not.toHaveBeenCalled();
      unmount();
      queryClient.clear();
    });
  });

  it('markNotificationsRead', async () => {
    // Mock initial fetch
    mockNotificationsResponse();

    vi.spyOn(client, 'markNotificationsAsRead').mockResolvedValue(
      {} as Awaited<ReturnType<typeof client.markNotificationsAsRead>>,
    );

    // Mock the automatic refetch after mutation
    mockNotificationsResponse();

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

    expect(result.current.notifications).toHaveLength(1);
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
    mockNotificationsResponse();

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

  it('preserves successful cloud batches, restores failures, and clears them on retry', async () => {
    const scopedCloudId = 'cloud-scoped-id' as CloudID;
    const scopedHost = 'some-tenant.atlassian.net' as Hostname;
    const accountWithHints = {
      ...mockAtlassianCloudAccount,
      hostnameHints: [{ hostname: scopedHost, cloudId: scopedCloudId }],
    };
    const succeededNotification: AtlassifyNotification = {
      ...mockSingleAtlassifyNotification,
      account: accountWithHints,
      id: 'succeeded-notification',
      order: 0,
      url: 'https://some-tenant.atlassian.net/wiki/test' as Link,
      notificationGroup: {
        ...mockSingleAtlassifyNotification.notificationGroup,
        size: 1,
      },
    };
    const failedNotification: AtlassifyNotification = {
      ...mockSingleAtlassifyNotification,
      account: accountWithHints,
      id: 'failed-notification',
      order: 1,
      url: 'https://bitbucket.org/example/test' as Link,
      notificationGroup: {
        ...mockSingleAtlassifyNotification.notificationGroup,
        size: 1,
      },
    };
    mockNotificationsResponse();
    const markReadSpy = vi
      .spyOn(client, 'markNotificationsAsRead')
      .mockImplementation(async (_account, _ids, cloudId) => {
        if (cloudId === undefined) {
          throw new Error('unscoped failure');
        }
        return {} as Awaited<ReturnType<typeof client.markNotificationsAsRead>>;
      });
    const { queryClient, result } = renderHookWithProviders(() =>
      useNotifications(),
    );
    await waitFor(() => expect(result.current.isFetching).toBe(false));
    const queryKey = queryClient.getQueryCache().getAll()[0].queryKey;
    act(() => {
      queryClient.setQueryData(queryKey, [
        {
          account: accountWithHints,
          notifications: [succeededNotification, failedNotification],
          error: null,
          hasMoreNotifications: false,
        },
      ]);
    });

    await act(async () => {
      await result.current.markNotificationsRead([
        succeededNotification,
        failedNotification,
      ]);
    });

    expect(
      queryClient.getQueryData<AccountNotifications[]>(queryKey)?.[0]
        .notifications,
    ).toEqual([failedNotification]);
    const failureKey = getNotificationFailureKey(
      accountWithHints,
      failedNotification.id,
    );
    expect(
      useNotificationActionFailuresStore.getState().failures[failureKey],
    ).toMatchObject({ action: 'read', error: Errors.UNKNOWN });

    markReadSpy.mockResolvedValue(
      {} as Awaited<ReturnType<typeof client.markNotificationsAsRead>>,
    );
    await act(async () => {
      await result.current.markNotificationsRead([failedNotification]);
    });

    expect(
      queryClient.getQueryData<AccountNotifications[]>(queryKey)?.[0]
        .notifications,
    ).toEqual([]);
    expect(
      useNotificationActionFailuresStore.getState().failures[failureKey],
    ).toBeUndefined();
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
    mockNotificationsResponse();

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
    mockNotificationsResponse();

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
    mockNotificationsResponse();

    vi.spyOn(client, 'markNotificationsAsUnread').mockResolvedValue(
      {} as Awaited<ReturnType<typeof client.markNotificationsAsUnread>>,
    );

    // Mock the automatic refetch after mutation
    mockNotificationsResponse();

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

    expect(result.current.notifications).toHaveLength(1);
  });
});
