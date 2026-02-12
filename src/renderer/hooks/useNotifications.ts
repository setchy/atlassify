import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Constants } from '../constants';

import useFiltersStore from '../stores/useFiltersStore';
import useSettingsStore from '../stores/useSettingsStore';

import type {
  Account,
  AccountNotifications,
  AtlassifyError,
  AtlassifyNotification,
  Status,
} from '../types';

import {
  getNotificationsByGroupId,
  markNotificationsAsRead,
  markNotificationsAsUnread,
} from '../utils/api/client';
import {
  markNotificationGroupAsRead,
  markNotificationGroupAsUnread,
} from '../utils/api/experimental/client';
import type { GroupNotificationDetailsFragment } from '../utils/api/graphql/generated/graphql';
import { trackEvent } from '../utils/comms';
import {
  areAllAccountErrorsSame,
  doesAllAccountsHaveErrors,
} from '../utils/errors';
import { rendererLogError } from '../utils/logger';
import { filterNotifications } from '../utils/notifications/filters';
import { isGroupNotification } from '../utils/notifications/group';
import { raiseNativeNotification } from '../utils/notifications/native';
import {
  getAllNotifications,
  getNotificationCount,
  hasMoreNotifications,
} from '../utils/notifications/notifications';
import { removeNotificationsForAccount } from '../utils/notifications/remove';
import { raiseSoundNotification } from '../utils/notifications/sound';
import { getNewNotifications } from '../utils/notifications/utils';
import { notificationsKeys } from '../utils/queryKeys';

interface NotificationsState {
  status: Status;
  globalError: AtlassifyError;

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

export const useNotifications = (accounts: Account[]): NotificationsState => {
  const queryClient = useQueryClient();
  const previousNotificationsRef = useRef<AccountNotifications[]>([]);

  // Subscribe to filter store to trigger re-render when filters change
  // This ensures the select function gets recreated with latest filter state
  const engagementStates = useFiltersStore((s) => s.engagementStates);
  const categories = useFiltersStore((s) => s.categories);
  const actors = useFiltersStore((s) => s.actors);
  const readStates = useFiltersStore((s) => s.readStates);
  const products = useFiltersStore((s) => s.products);

  // Get settings to determine query key
  const fetchOnlyUnreadNotifications = useSettingsStore(
    (s) => s.fetchOnlyUnreadNotifications,
  );

  // Query key excludes filters to prevent API refetches on filter changes
  // Filters are applied client-side via subscription in subscriptions.ts
  const notificationsQueryKey = useMemo(
    () => notificationsKeys.list(accounts.length, fetchOnlyUnreadNotifications),
    [accounts.length, fetchOnlyUnreadNotifications],
  );

  // Create select function that depends on filter state
  // biome-ignore lint/correctness/useExhaustiveDependencies: specify all filters to ensure this function is recreated on change, causing Tanstack Query to re-run.
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
    isError,
    refetch,
  } = useQuery<AccountNotifications[], Error>({
    queryKey: notificationsQueryKey,

    queryFn: async () => {
      return await getAllNotifications(accounts);
    },

    // Apply filters as a transformation on the cached data
    // This allows filter changes to instantly update without refetching
    select: selectFilteredNotifications,

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

  // Determine status and globalError from query state
  const status: Status = useMemo(() => {
    if (isLoading) {
      return 'loading';
    }

    if (isError) {
      return 'error';
    }

    return 'success';
  }, [isLoading, isError]);

  const globalError: AtlassifyError = useMemo(() => {
    if (!isError || notifications.length === 0) {
      return null;
    }

    const allAccountsHaveErrors = doesAllAccountsHaveErrors(notifications);
    const allAccountErrorsAreSame = areAllAccountErrorsSame(notifications);

    if (allAccountsHaveErrors && allAccountErrorsAreSame) {
      return notifications[0].error;
    }

    return null;
  }, [isError, notifications]);

  const refetchNotifications = useCallback(async () => {
    await refetch();
  }, [refetch]);

  // Get settings for notifications side effects
  const playSoundNewNotifications = useSettingsStore(
    (s) => s.playSoundNewNotifications,
  );
  const showSystemNotifications = useSettingsStore(
    (s) => s.showSystemNotifications,
  );
  const notificationVolume = useSettingsStore((s) => s.notificationVolume);

  // Handle sound and native notifications when new notifications arrive
  useEffect(() => {
    if (isLoading || isError || notifications.length === 0) {
      return;
    }

    const allAccountsHaveErrors = doesAllAccountsHaveErrors(notifications);
    if (allAccountsHaveErrors) {
      return;
    }

    const diffNotifications = getNewNotifications(
      previousNotificationsRef.current,
      notifications,
    );

    if (diffNotifications.length > 0) {
      if (playSoundNewNotifications) {
        raiseSoundNotification(notificationVolume);
      }

      if (showSystemNotifications) {
        raiseNativeNotification(diffNotifications);
      }
    }

    previousNotificationsRef.current = notifications;
  }, [
    notifications,
    isLoading,
    isError,
    playSoundNewNotifications,
    showSystemNotifications,
    notificationVolume,
  ]);

  /**
   * @deprecated Retained as a fallback while trailing the experimental group
   * mutations (markNotificationGroupAsRead/Unread). Prefer the experimental
   * client mutations whenever possible.
   *
   * TODO - this is deprecated.  Remove in a future stable release.
   */
  // @ts-expect-error
  const getNotificationIdsForGroups = useCallback(
    async (notifications: AtlassifyNotification[]) => {
      const notificationIDs: string[] = [];

      const account = notifications[0].account;

      const groupNotifications = notifications.filter((notification) =>
        isGroupNotification(notification),
      );

      try {
        for (const group of groupNotifications) {
          const res = await getNotificationsByGroupId(
            account,
            group.notificationGroup.id,
            group.notificationGroup.size,
          );

          const groupNotifications = res.data.notifications.notificationGroup
            .nodes as GroupNotificationDetailsFragment[];

          const groupNotificationIDs = groupNotifications.map(
            (notification) => notification.notificationId,
          );

          notificationIDs.push(...groupNotificationIDs);
        }
      } catch (err) {
        rendererLogError(
          'getNotificationIdsForGroups',
          'Error occurred while fetching notification ids for notification groups',
          err,
        );
      }

      return notificationIDs;
    },
    [],
  );

  // Mutation for marking notifications as read
  const markAsReadMutation = useMutation({
    mutationFn: async ({
      readNotifications,
    }: {
      readNotifications: AtlassifyNotification[];
    }) => {
      trackEvent('Action', { name: 'Mark as Read' });

      const account = readNotifications[0].account;

      const singleNotifications = readNotifications.filter(
        (notification) => !isGroupNotification(notification),
      );
      const groupNotifications = readNotifications.filter((notification) =>
        isGroupNotification(notification),
      );

      const singleNotificationIDs = singleNotifications.map(
        (notification) => notification.id,
      );

      if (singleNotificationIDs.length > 0) {
        await markNotificationsAsRead(account, singleNotificationIDs);
      }

      if (groupNotifications.length > 0) {
        await Promise.all(
          groupNotifications.map((group) =>
            markNotificationGroupAsRead(account, group.notificationGroup.id),
          ),
        );
      }

      for (const notification of readNotifications) {
        notification.readState = 'read';
      }

      const updatedNotifications = removeNotificationsForAccount(
        account,
        readNotifications,
        notifications,
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

      const account = unreadNotifications[0].account;

      const singleNotifications = unreadNotifications.filter(
        (notification) => !isGroupNotification(notification),
      );
      const groupNotifications = unreadNotifications.filter((notification) =>
        isGroupNotification(notification),
      );

      const singleNotificationIDs = singleNotifications.map(
        (notification) => notification.id,
      );

      if (singleNotificationIDs.length > 0) {
        await markNotificationsAsUnread(account, singleNotificationIDs);
      }

      if (groupNotifications.length > 0) {
        await Promise.all(
          groupNotifications.map((group) =>
            markNotificationGroupAsUnread(account, group.notificationGroup.id),
          ),
        );
      }

      for (const notification of unreadNotifications) {
        notification.readState = 'unread';
      }

      return notifications;
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
    status,
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
