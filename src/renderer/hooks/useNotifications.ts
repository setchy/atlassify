import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Constants } from '../constants';

import type {
  AccountNotifications,
  AtlassifyError,
  AtlassifyNotification,
  AtlassifyState,
  Status,
} from '../types';

import {
  getNotificationsByGroupId,
  markNotificationsAsRead,
  markNotificationsAsUnread,
} from '../utils/api/client';
import type { GroupNotificationDetailsFragment } from '../utils/api/graphql/generated/graphql';
import { trackEvent } from '../utils/comms';
import {
  areAllAccountErrorsSame,
  doesAllAccountsHaveErrors,
} from '../utils/errors';
import { rendererLogError } from '../utils/logger';
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

interface NotificationsState {
  status: Status;
  globalError: AtlassifyError;

  notifications: AccountNotifications[];
  notificationCount: number;
  hasNotifications: boolean;
  hasMoreAccountNotifications: boolean;

  refetch: () => Promise<void>;

  markNotificationsRead: (
    state: AtlassifyState,
    notifications: AtlassifyNotification[],
  ) => Promise<void>;
  markNotificationsUnread: (
    state: AtlassifyState,
    notifications: AtlassifyNotification[],
  ) => Promise<void>;
}

export const useNotifications = (state: AtlassifyState): NotificationsState => {
  const queryClient = useQueryClient();
  const previousNotificationsRef = useRef<AccountNotifications[]>([]);

  // Query for fetching notifications - React Query handles polling and refetching
  const {
    data: notifications = [],
    isLoading,
    isError,
    refetch: queryRefetch,
  } = useQuery<AccountNotifications[], Error>({
    queryKey: [
      'notifications',
      state.auth.accounts.length,
      state.settings.fetchOnlyUnreadNotifications,
    ],

    queryFn: async () => {
      return await getAllNotifications(state);
    },

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

  const refetch = useCallback(async () => {
    await queryRefetch();
  }, [queryRefetch]);

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
      if (state.settings.playSoundNewNotifications) {
        raiseSoundNotification(state.settings.notificationVolume);
      }

      if (state.settings.showSystemNotifications) {
        raiseNativeNotification(diffNotifications);
      }
    }

    previousNotificationsRef.current = notifications;
  }, [
    notifications,
    isLoading,
    isError,
    state.settings.playSoundNewNotifications,
    state.settings.showSystemNotifications,
    state.settings.notificationVolume,
  ]);

  const getNotificationIdsForGroups = useCallback(
    async (state: AtlassifyState, notifications: AtlassifyNotification[]) => {
      const notificationIDs: string[] = [];

      const account = notifications[0].account;

      const groupNotifications = notifications.filter((notification) =>
        isGroupNotification(notification),
      );

      try {
        for (const group of groupNotifications) {
          const res = await getNotificationsByGroupId(
            account,
            state.settings,
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
      state,
      readNotifications,
    }: {
      state: AtlassifyState;
      readNotifications: AtlassifyNotification[];
    }) => {
      trackEvent('Action', { name: 'Mark as Read' });

      const account = readNotifications[0].account;

      const singleGroupNotifications = readNotifications.filter(
        (notification) => !isGroupNotification(notification),
      );
      const singleNotificationIDs = singleGroupNotifications.map(
        (notification) => notification.id,
      );

      const groupedNotificationIds = await getNotificationIdsForGroups(
        state,
        readNotifications,
      );

      singleNotificationIDs.push(...groupedNotificationIds);

      await markNotificationsAsRead(account, singleNotificationIDs);

      for (const notification of readNotifications) {
        notification.readState = 'read';
      }

      const updatedNotifications = removeNotificationsForAccount(
        account,
        state.settings,
        readNotifications,
        notifications,
      );

      return updatedNotifications;
    },

    onSuccess: (updatedNotifications) => {
      queryClient.setQueryData(
        [
          'notifications',
          state.auth.accounts.length,
          state.settings.fetchOnlyUnreadNotifications,
        ],
        updatedNotifications,
      );
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
      state,
      unreadNotifications,
    }: {
      state: AtlassifyState;
      unreadNotifications: AtlassifyNotification[];
    }) => {
      trackEvent('Action', {
        name: 'Mark as Unread',
      });

      const account = unreadNotifications[0].account;

      const singleGroupNotifications = unreadNotifications.filter(
        (notification) => !isGroupNotification(notification),
      );
      const singleNotificationIDs = singleGroupNotifications.map(
        (notification) => notification.id,
      );

      const groupedNotificationIds = await getNotificationIdsForGroups(
        state,
        unreadNotifications,
      );

      singleNotificationIDs.push(...groupedNotificationIds);

      await markNotificationsAsUnread(account, singleNotificationIDs);

      for (const notification of unreadNotifications) {
        notification.readState = 'unread';
      }

      return notifications;
    },

    onSuccess: (updatedNotifications) => {
      queryClient.setQueryData(
        [
          'notifications',
          state.auth.accounts.length,
          state.settings.fetchOnlyUnreadNotifications,
        ],
        updatedNotifications,
      );
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
    async (
      state: AtlassifyState,
      readNotifications: AtlassifyNotification[],
    ) => {
      await markAsReadMutation.mutateAsync({ state, readNotifications });
    },
    [markAsReadMutation],
  );

  const markNotificationsUnread = useCallback(
    async (
      state: AtlassifyState,
      unreadNotifications: AtlassifyNotification[],
    ) => {
      await markAsUnreadMutation.mutateAsync({ state, unreadNotifications });
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

    refetch,

    markNotificationsRead,
    markNotificationsUnread,
  };
};
