import { useCallback, useEffect, useMemo, useRef } from 'react';

import {
  keepPreviousData,
  type UseMutationResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { Constants } from '../constants';

import { useIntervalTimer } from '../hooks/useIntervalTimer';
import {
  useAccountsStore,
  useFiltersStore,
  useRuntimeStore,
  useSettingsStore,
} from '../stores';

import type {
  Account,
  AccountNotifications,
  AtlassifyError,
  AtlassifyNotification,
} from '../types';

import {
  markNotificationsAsRead,
  markNotificationsAsUnread,
} from '../utils/api/client';
import { notificationsKeys } from '../utils/api/queryKeys';
import {
  areAllAccountErrorsSame,
  doesAllAccountsHaveErrors,
  Errors,
} from '../utils/core/errors';
import { rendererLogError } from '../utils/core/logger';
import {
  getAllNotifications,
  getNewNotifications,
  getNotificationCount,
  hasMoreNotifications,
} from '../utils/notifications/fetch';
import { filterNotifications } from '../utils/notifications/filters';
import { resolveNotificationIdsForGroup } from '../utils/notifications/group';
import {
  type NotificationActionType,
  postProcessNotifications,
  shouldRemoveNotificationsFromState,
  updateNotificationsReadState,
} from '../utils/notifications/postProcess';
import { raiseSoundNotification } from '../utils/system/audio';
import { trackEvent } from '../utils/system/comms';
import { raiseNativeNotification } from '../utils/system/native';

/**
 * State and actions for notifications management.
 */
interface NotificationsState {
  isLoading: boolean;
  isFetching: boolean;
  isErrorOrPaused: boolean;

  globalError: AtlassifyError | null;

  notifications: AccountNotifications[];
  notificationCount: number;
  hasNotifications: boolean;
  hasMoreAccountNotifications: boolean;

  refetchNotifications: () => Promise<void>;

  markNotificationsRead: (
    notifications: AtlassifyNotification[],
  ) => Promise<void>;
  markNotificationsUnread: (
    notifications: AtlassifyNotification[],
  ) => Promise<void>;

  markAsMutation: UseMutationResult<
    {
      account: Account;
      targetNotifications: AtlassifyNotification[];
      action: NotificationActionType;
    },
    Error,
    {
      targetNotifications: AtlassifyNotification[];
      action: NotificationActionType;
    }
  >;
}

/**
 * Custom hook for managing notifications state, actions, and side effects.
 * Handles fetching, filtering, marking as read/unread, and notification triggers.
 */
export const useNotifications = (): NotificationsState => {
  const queryClient = useQueryClient();

  // Track previous notifications for diffing new notifications
  const previousNotificationsRef = useRef<AccountNotifications[]>([]);

  // Account store values
  const accounts = useAccountsStore((s) => s.accounts);

  // Filter store values
  const engagementStates = useFiltersStore((s) => s.engagementStates);
  const categories = useFiltersStore((s) => s.categories);
  const actors = useFiltersStore((s) => s.actors);
  const readStates = useFiltersStore((s) => s.readStates);
  const products = useFiltersStore((s) => s.products);

  // Setting store values
  const fetchOnlyUnreadNotifications = useSettingsStore(
    (s) => s.fetchOnlyUnreadNotifications,
  );
  const groupNotificationsByTitle = useSettingsStore(
    (s) => s.groupNotificationsByTitle,
  );
  const playSoundNewNotifications = useSettingsStore(
    (s) => s.playSoundNewNotifications,
  );
  const showSystemNotifications = useSettingsStore(
    (s) => s.showSystemNotifications,
  );
  const notificationVolume = useSettingsStore((s) => s.notificationVolume);

  // Query key excludes filters to prevent API refetches on filter changes
  // Filters are applied client-side via subscription in subscriptions.ts
  const notificationsQueryKey = useMemo(
    () =>
      notificationsKeys.list(
        accounts.length,
        fetchOnlyUnreadNotifications,
        groupNotificationsByTitle,
      ),
    [accounts.length, fetchOnlyUnreadNotifications, groupNotificationsByTitle],
  );

  // Create select function that depends on filter state
  // biome-ignore lint/correctness/useExhaustiveDependencies: Recreate selection function on filter store changes
  const selectFilteredNotifications = useMemo(
    () => (data: AccountNotifications[]) =>
      data.map((accountNotifications) => ({
        ...accountNotifications,
        notifications: filterNotifications(accountNotifications.notifications),
      })),
    [engagementStates, categories, actors, readStates, products],
  );

  // Query for fetching notifications - React Query handles polling and refetching
  const {
    data: notifications = [],
    isLoading,
    isFetching,
    isError,
    isPaused,
    refetch,
  } = useQuery<AccountNotifications[], Error>({
    queryKey: notificationsQueryKey,

    queryFn: async () => {
      return await getAllNotifications();
    },

    // Apply filters as a transformation on the cached data
    // This allows filter changes to instantly update without refetching
    select: selectFilteredNotifications,

    placeholderData: keepPreviousData,

    // Manual interval-based fetching (see useIntervalTimer below) instead of refetchInterval
    // and refetchIntervalInBackground to ensure reliable background fetching.
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });

  const notificationCount = getNotificationCount(notifications);
  const hasNotifications = notificationCount > 0;
  const hasMoreAccountNotifications = hasMoreNotifications(notifications);

  const isErrorOrPaused = isError || isPaused;

  /**
   * Manual interval-based fetching for reliable background updates.
   * This ensures fetching continues even when the app is in the background,
   * and isn't deferred by TanStack Query's internal logic during mutations or state changes.
   * This also provides graceful recovery after system sleep/suspend.
   *
   * In future maybe we can switch back to TanStack Query's
   * refetchInterval and refetchIntervalInBackground
   */
  useIntervalTimer(() => {
    refetch();
  }, Constants.FETCH_NOTIFICATIONS_INTERVAL_MS);

  // Determine global error from query state
  const globalError: AtlassifyError | null = useMemo(() => {
    // If paused due to offline, show network error
    if (isPaused) {
      return Errors.OFFLINE;
    }

    if (!isError || notifications.length === 0) {
      return null;
    }

    const allAccountsHaveErrors = doesAllAccountsHaveErrors(notifications);
    const allAccountErrorsAreSame = areAllAccountErrorsSame(notifications);

    if (allAccountsHaveErrors && allAccountErrorsAreSame) {
      return notifications[0].error;
    }

    return null;
  }, [isPaused, isError, notifications]);

  /**
   * Sync filtered notification derived states to store so tray updates outside React
   * components can read pre-filtered values without re-applying filter logic.
   */
  useEffect(() => {
    useRuntimeStore
      .getState()
      .updateNotificationStatus(
        notificationCount,
        hasMoreAccountNotifications,
        isErrorOrPaused,
      );
  }, [notificationCount, hasMoreAccountNotifications, isErrorOrPaused]);

  const refetchNotifications = useCallback(async () => {
    await refetch();
  }, [refetch]);

  // Handle sound and native notifications when new notifications arrive
  useEffect(() => {
    if (isLoading || isErrorOrPaused || notifications.length === 0) {
      return;
    }

    const allAccountsHaveErrors = doesAllAccountsHaveErrors(notifications);
    if (allAccountsHaveErrors) {
      return;
    }

    const unfilteredNotifications =
      queryClient.getQueryData<AccountNotifications[]>(notificationsQueryKey) ||
      [];

    // Find new notifications by diffing previous and current
    const diffNotifications = getNewNotifications(
      previousNotificationsRef.current,
      unfilteredNotifications,
    );

    if (diffNotifications.length > 0) {
      // Apply filters to new notifications so only filtered notifications trigger alerts
      const filteredDiffNotifications = filterNotifications(diffNotifications);

      if (filteredDiffNotifications.length > 0) {
        // Play sound and show system notifications for new filtered notifications
        if (playSoundNewNotifications) {
          raiseSoundNotification(notificationVolume);
        }

        if (showSystemNotifications) {
          raiseNativeNotification(filteredDiffNotifications);
        }
      }
    }

    previousNotificationsRef.current = unfilteredNotifications;
  }, [
    notifications,
    isLoading,
    isErrorOrPaused,
    playSoundNewNotifications,
    showSystemNotifications,
    notificationVolume,
    queryClient,
    notificationsQueryKey,
  ]);

  // Unified mutation for marking notifications as read or unread
  const markAsMutation = useMutation({
    onMutate: async ({ targetNotifications, action }) => {
      // Cancel any outgoing refetches to prevent them from overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: notificationsKeys.all });

      // Snapshot ALL notification queries for rollback on error
      const previousQueriesData = queryClient.getQueriesData<
        AccountNotifications[]
      >({
        queryKey: notificationsKeys.all,
      });

      // Optimistically update ALL notification queries in cache
      // This ensures the UI updates immediately regardless of which query key is active
      const account = targetNotifications[0].account;
      const affectedNotificationIds = new Set(
        targetNotifications.map((n) => n.id),
      );

      queryClient.setQueriesData<AccountNotifications[]>(
        { queryKey: notificationsKeys.all },
        (oldData) => {
          if (!oldData) {
            return oldData;
          }

          let optimisticNotifications: AccountNotifications[];

          if (action === 'unread') {
            // For unread, use full post-processing (no removal happens anyway)
            optimisticNotifications = postProcessNotifications(
              account,
              oldData,
              targetNotifications,
              action,
            );
          } else {
            // For read, only update read state without removing (removal happens after animation)
            optimisticNotifications = updateNotificationsReadState(
              account,
              oldData,
              affectedNotificationIds,
              action,
            );
          }

          return optimisticNotifications;
        },
      );

      // Return context with snapshot for potential rollback
      return { previousQueriesData };
    },

    mutationFn: async ({
      targetNotifications,
      action,
    }: {
      targetNotifications: AtlassifyNotification[];
      action: NotificationActionType;
    }) => {
      const markAsApiFn =
        action === 'read' ? markNotificationsAsRead : markNotificationsAsUnread;

      trackEvent('Action', {
        name: action === 'read' ? 'Mark as Read' : 'Mark as Unread',
      });

      // TODO - Ideally we would achieve this in a better way
      const account = targetNotifications[0].account;

      // Assert all notifications are for the same account
      if (!targetNotifications.every((n) => n.account === account)) {
        throw new Error('All notifications must belong to the same account');
      }

      const notificationIDs = await resolveNotificationIdsForGroup(
        account,
        targetNotifications,
      );

      await markAsApiFn(account, notificationIDs);

      // Return data needed for post-processing
      return { account, targetNotifications, action };
    },

    onSuccess: ({ account, targetNotifications, action }) => {
      // Delay cache update to allow optimistic UI animations to complete.
      // Components trigger animations immediately for seamless UX.
      // If notifications will be removed from state after being marked read,
      // we wait for the exit animation to finish before updating the cache.
      const shouldRemove =
        action === 'read' && shouldRemoveNotificationsFromState();
      const delay = shouldRemove
        ? Constants.NOTIFICATION_EXIT_ANIMATION_DURATION_MS
        : 0;

      setTimeout(() => {
        // Update ALL notification queries with post-processed data
        // This ensures consistency across different query keys (e.g., show all vs unread only)
        queryClient.setQueriesData<AccountNotifications[]>(
          { queryKey: notificationsKeys.all },
          (oldData) => {
            if (!oldData) {
              return oldData;
            }

            return postProcessNotifications(
              account,
              oldData,
              targetNotifications,
              action,
            );
          },
        );

        // Invalidate all notification queries to ensure fresh data when
        // switching between different query parameters (e.g., fetchOnlyUnread toggle).
        // This prevents stale cache issues when toggling view modes after mutations.
        queryClient.invalidateQueries({
          queryKey: notificationsKeys.all,
          refetchType: 'none', // Don't refetch the current query since we just updated it
        });
      }, delay);
    },

    onError: (err, { action }, context) => {
      // Rollback ALL notification queries to their snapshots on error
      if (context?.previousQueriesData) {
        for (const [queryKey, data] of context.previousQueriesData) {
          queryClient.setQueryData(queryKey, data);
        }
      }

      // Components watch mutation.isError and rollback optimistic UI changes
      // (e.g., reverse exit animations) when errors occur.
      rendererLogError(
        action === 'read' ? 'markNotificationsRead' : 'markNotificationsUnread',
        `Error occurred while marking notifications as ${action}`,
        err,
      );
    },
  });

  const markNotificationsRead = useCallback(
    async (readNotifications: AtlassifyNotification[]) => {
      await markAsMutation.mutateAsync({
        targetNotifications: readNotifications,
        action: 'read',
      });
    },
    [markAsMutation],
  );

  const markNotificationsUnread = useCallback(
    async (unreadNotifications: AtlassifyNotification[]) => {
      await markAsMutation.mutateAsync({
        targetNotifications: unreadNotifications,
        action: 'unread',
      });
    },
    [markAsMutation],
  );

  return {
    isLoading,
    isFetching,
    isErrorOrPaused,

    globalError,

    notifications,
    notificationCount,
    hasNotifications,
    hasMoreAccountNotifications,

    refetchNotifications,

    markNotificationsRead,
    markNotificationsUnread,

    markAsMutation,
  };
};
