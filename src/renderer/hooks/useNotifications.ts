import { useCallback, useEffect, useMemo, useRef } from 'react';

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { Constants } from '../constants';

import {
  useAccountsStore,
  useFiltersStore,
  useRuntimeStore,
  useSettingsStore,
} from '../stores';

import type {
  AccountNotifications,
  AtlassifyError,
  AtlassifyNotification,
} from '../types';

import {
  markNotificationsAsRead,
  markNotificationsAsUnread,
} from '../utils/api/client';
import { notificationsKeys } from '../utils/api/queryKeys';
import { trackEvent } from '../utils/comms';
import {
  areAllAccountErrorsSame,
  doesAllAccountsHaveErrors,
  Errors,
} from '../utils/errors';
import { rendererLogError } from '../utils/logger';
import { filterNotifications } from '../utils/notifications/filters';
import { resolveNotificationIdsForGroup } from '../utils/notifications/group';
import { raiseNativeNotification } from '../utils/notifications/native';
import {
  getAllNotifications,
  getNotificationCount,
  hasMoreNotifications,
} from '../utils/notifications/notifications';
import { postProcessNotifications } from '../utils/notifications/postProcess';
import { raiseSoundNotification } from '../utils/notifications/sound';
import { getNewNotifications } from '../utils/notifications/utils';

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

    refetchInterval: Constants.FETCH_NOTIFICATIONS_INTERVAL_MS,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });

  const notificationCount = getNotificationCount(notifications);

  const hasNotifications = useMemo(
    () => notificationCount > 0,
    [notificationCount],
  );

  const hasMoreAccountNotifications = useMemo(
    () => hasMoreNotifications(notifications),
    [notifications],
  );

  const isErrorOrPaused = isError || isPaused;

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

  // Mutation for marking notifications as read
  const markAsReadMutation = useMutation({
    mutationFn: async ({
      readNotifications,
    }: {
      readNotifications: AtlassifyNotification[];
    }) => {
      trackEvent('Action', { name: 'Mark as Read' });

      // TODO - Ideally we would achieve this in a better way
      const account = readNotifications[0].account;

      // Assert all notifications are for the same account
      if (!readNotifications.every((n) => n.account === account)) {
        throw new Error('All notifications must belong to the same account');
      }

      const notificationIDs = await resolveNotificationIdsForGroup(
        account,
        readNotifications,
      );

      await markNotificationsAsRead(account, notificationIDs);

      const updatedNotifications = postProcessNotifications(
        account,
        notifications,
        readNotifications,
        'read',
      );
      return updatedNotifications;
    },

    onSuccess: (updatedNotifications) => {
      queryClient.setQueryData(notificationsQueryKey, updatedNotifications);
    },

    onError: (err) => {
      rendererLogError(
        'markNotificationsRead',
        'Error occurred while marking notifications as read',
        err,
      );
    },
  });

  // Mutation for marking notifications as unread
  const markAsUnreadMutation = useMutation({
    mutationFn: async ({
      unreadNotifications,
    }: {
      unreadNotifications: AtlassifyNotification[];
    }) => {
      trackEvent('Action', {
        name: 'Mark as Unread',
      });

      // TODO - Ideally we would achieve this in a better way
      const account = unreadNotifications[0].account;

      // Assert all notifications are for the same account
      if (!unreadNotifications.every((n) => n.account === account)) {
        throw new Error('All notifications must belong to the same account');
      }

      const notificationIDs = await resolveNotificationIdsForGroup(
        account,
        unreadNotifications,
      );

      await markNotificationsAsUnread(account, notificationIDs);

      const updatedNotifications = postProcessNotifications(
        account,
        notifications,
        unreadNotifications,
        'unread',
      );

      return updatedNotifications;
    },

    onSuccess: (updatedNotifications) => {
      queryClient.setQueryData(notificationsQueryKey, updatedNotifications);
    },

    onError: (err) => {
      rendererLogError(
        'markNotificationsUnread',
        'Error occurred while marking notifications as unread',
        err,
      );
    },
  });

  const markNotificationsRead = useCallback(
    async (readNotifications: AtlassifyNotification[]) => {
      await markAsReadMutation.mutateAsync({ readNotifications });
    },
    [markAsReadMutation],
  );

  const markNotificationsUnread = useCallback(
    async (unreadNotifications: AtlassifyNotification[]) => {
      await markAsUnreadMutation.mutateAsync({ unreadNotifications });
    },
    [markAsUnreadMutation],
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
  };
};
