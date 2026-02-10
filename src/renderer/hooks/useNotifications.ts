import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Constants } from '../constants';

import type {
  AccountNotifications,
  AtlassifyError,
  AtlassifyNotification,
  AtlassifyState,
  Status,
} from '../types';

import useFiltersStore from '../stores/useFiltersStore';
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

  refetchNotifications: () => Promise<void>;

  markNotificationsRead: (
    state: AtlassifyState,
    notifications: AtlassifyNotification[],
  ) => Promise<void>;
  markNotificationsUnread: (
    state: AtlassifyState,
    notifications: AtlassifyNotification[],
  ) => Promise<void>;

  // Mutation states for showing loading indicators
  isMarkingAsRead: boolean;
  isMarkingAsUnread: boolean;
  isNotificationPending: (notificationId: string) => boolean;
}

export const useNotifications = (state: AtlassifyState): NotificationsState => {
  const queryClient = useQueryClient();
  const previousNotificationsRef = useRef<AccountNotifications[]>([]);

  // Track which specific notification IDs are currently being processed
  const [pendingNotificationIds, setPendingNotificationIds] = useState<
    Set<string>
  >(new Set());

  const engagementStates = useFiltersStore((s) => s.engagementStates);
  const categories = useFiltersStore((s) => s.categories);
  const actors = useFiltersStore((s) => s.actors);
  const readStates = useFiltersStore((s) => s.readStates);
  const products = useFiltersStore((s) => s.products);

  // Flattened, stable query key that includes current filter values
  const notificationsQueryKey = useMemo(() => {
    return [
      'notifications',
      state.auth.accounts.length,
      state.settings.fetchOnlyUnreadNotifications,
      ...engagementStates,
      ...categories,
      ...actors,
      ...readStates,
      ...products,
    ] as const;
  }, [
    state.auth.accounts.length,
    state.settings.fetchOnlyUnreadNotifications,
    engagementStates,
    categories,
    actors,
    readStates,
    products,
  ]);

  // Query for fetching notifications - React Query handles polling and refetching
  const {
    data: notifications = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<AccountNotifications[], Error>({
    queryKey: notificationsQueryKey,

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

  const refetchNotifications = useCallback(async () => {
    await refetch();
  }, [refetch]);

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

  // Helper to check if a specific notification is pending
  const isNotificationPending = useCallback(
    (notificationId: string) => pendingNotificationIds.has(notificationId),
    [pendingNotificationIds],
  );

  // Mutation for marking notifications as read
  const markAsReadMutation = useMutation({
    // Optimistically update the cache before API call for instant UI feedback
    onMutate: async ({
      state: _state,
      readNotifications,
    }: {
      state: AtlassifyState;
      readNotifications: AtlassifyNotification[];
    }) => {
      // Add these notification IDs to pending set
      setPendingNotificationIds((prev) => {
        const next = new Set(prev);
        for (const n of readNotifications) {
          next.add(n.id);
        }
        return next;
      });

      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: notificationsQueryKey });

      // Snapshot the previous value for rollback
      const previousNotifications = queryClient.getQueryData<
        AccountNotifications[]
      >(notificationsQueryKey);

      // Optimistically update the cache
      queryClient.setQueryData<AccountNotifications[]>(
        notificationsQueryKey,
        (old) => {
          if (!old) {
            return old;
          }

          const account = readNotifications[0].account;

          return old.map((accountNotifications) => {
            if (accountNotifications.account.id !== account.id) {
              return accountNotifications;
            }

            // Update readState for the notifications
            const notificationIDsToUpdate = new Set(
              readNotifications.map((n) => n.id),
            );

            const updatedNotifications = accountNotifications.notifications.map(
              (n) =>
                notificationIDsToUpdate.has(n.id)
                  ? { ...n, readState: 'read' as const }
                  : n,
            );

            // Don't filter out notifications yet - let animation play
            // Removal happens in onSettled after animation completes
            return {
              ...accountNotifications,
              notifications: updatedNotifications,
            };
          });
        },
      );

      // Return context for rollback and timing
      return { previousNotifications, startTime: Date.now() };
    },

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

      // Make the API call
      await markNotificationsAsRead(account, singleNotificationIDs);
    },

    onError: (err, _variables, context) => {
      // Rollback to previous state on error
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          notificationsQueryKey,
          context.previousNotifications,
        );
      }

      rendererLogError(
        'markNotificationsRead',
        'Error occurred while marking notifications as read',
        err,
      );
    },

    // Refetch to ensure we're in sync with server and remove from pending
    onSettled: (_data, _error, variables, context) => {
      const ANIMATION_DURATION = 700; // ms
      const MIN_REMOVAL_DELAY = 100; // ms buffer

      // Calculate how long the API call took
      const apiDuration = context?.startTime
        ? Date.now() - context.startTime
        : 0;

      // If API was faster than animation, wait for animation to complete
      // If API was slower, remove almost immediately (animation already done)
      const removalDelay = Math.max(
        MIN_REMOVAL_DELAY,
        ANIMATION_DURATION - apiDuration + MIN_REMOVAL_DELAY,
      );

      setTimeout(() => {
        // Remove notification IDs from pending set
        setPendingNotificationIds((prev) => {
          const next = new Set(prev);
          for (const n of variables.readNotifications) {
            next.delete(n.id);
          }
          return next;
        });

        // Now apply the actual removal from cache if needed using helper
        queryClient.setQueryData<AccountNotifications[]>(
          notificationsQueryKey,
          (old) => {
            if (!old) {
              return old;
            }

            const account = variables.readNotifications[0].account;

            // Use the helper function to handle removal/update logic
            return removeNotificationsForAccount(
              account,
              variables.state.settings,
              variables.readNotifications,
              old,
            );
          },
        );

        queryClient.invalidateQueries({ queryKey: notificationsQueryKey });
      }, removalDelay);
    },
  });

  // Mutation for marking notifications as unread
  const markAsUnreadMutation = useMutation({
    // Optimistically update the cache before API call
    onMutate: async ({
      state: _state,
      unreadNotifications,
    }: {
      state: AtlassifyState;
      unreadNotifications: AtlassifyNotification[];
    }) => {
      // Add these notification IDs to pending set
      setPendingNotificationIds((prev) => {
        const next = new Set(prev);
        for (const n of unreadNotifications) {
          next.add(n.id);
        }
        return next;
      });

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: notificationsQueryKey });

      // Snapshot the previous value for rollback
      const previousNotifications = queryClient.getQueryData<
        AccountNotifications[]
      >(notificationsQueryKey);

      // Optimistically update the cache
      queryClient.setQueryData<AccountNotifications[]>(
        notificationsQueryKey,
        (old) => {
          if (!old) {
            return old;
          }

          const account = unreadNotifications[0].account;

          return old.map((accountNotifications) => {
            if (accountNotifications.account.id !== account.id) {
              return accountNotifications;
            }

            // Update readState for the notifications
            const updatedNotifications = accountNotifications.notifications.map(
              (n) => {
                const shouldMarkUnread = unreadNotifications.some(
                  (un) => un.id === n.id,
                );
                if (shouldMarkUnread) {
                  return { ...n, readState: 'unread' as const };
                }
                return n;
              },
            );

            return {
              ...accountNotifications,
              notifications: updatedNotifications,
            };
          });
        },
      );

      // Return context for rollback
      return { previousNotifications, startTime: Date.now() };
    },

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

      // Make the API call
      await markNotificationsAsUnread(account, singleNotificationIDs);
    },

    onError: (err, _variables, context) => {
      // Rollback to previous state on error
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          notificationsQueryKey,
          context.previousNotifications,
        );
      }

      rendererLogError(
        'markNotificationsUnread',
        'Error occurred while marking notifications as unread',
        err,
      );
    },

    // Refetch to ensure we're in sync with server and remove from pending
    onSettled: (_data, _error, variables, _context) => {
      const MIN_REMOVAL_DELAY = 100; // ms buffer

      // For unread, no removal animation, so just use minimal delay
      // Could be made dynamic based on _context?.startTime if needed
      const removalDelay = MIN_REMOVAL_DELAY;

      setTimeout(() => {
        // Remove notification IDs from pending set
        setPendingNotificationIds((prev) => {
          const next = new Set(prev);
          for (const n of variables.unreadNotifications) {
            next.delete(n.id);
          }
          return next;
        });

        queryClient.invalidateQueries({ queryKey: notificationsQueryKey });
      }, removalDelay);
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

    refetchNotifications,

    markNotificationsRead,
    markNotificationsUnread,

    // Expose mutation states for loading indicators
    isMarkingAsRead: markAsReadMutation.isPending,
    isMarkingAsUnread: markAsUnreadMutation.isPending,
    isNotificationPending,
  };
};
