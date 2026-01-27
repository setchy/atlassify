import { useCallback, useMemo, useRef, useState } from 'react';

import { trackEvent } from '@aptabase/electron/renderer';

import type {
  Account,
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
import {
  areAllAccountErrorsSame,
  doesAllAccountsHaveErrors,
} from '../utils/errors';
import { rendererLogError } from '../utils/logger';
import { raiseNativeNotification } from '../utils/notifications/native';
import {
  getAllNotifications,
  getNotificationCount,
  hasMoreNotifications,
  isGroupNotification,
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

  fetchNotifications: (state: AtlassifyState) => Promise<void>;
  removeAccountNotifications: (account: Account) => Promise<void>;

  markNotificationsRead: (
    state: AtlassifyState,
    notifications: AtlassifyNotification[],
  ) => Promise<void>;
  markNotificationsUnread: (
    state: AtlassifyState,
    notifications: AtlassifyNotification[],
  ) => Promise<void>;
}

export const useNotifications = (): NotificationsState => {
  const [status, setStatus] = useState<Status>('success');
  const [globalError, setGlobalError] = useState<AtlassifyError>();

  const [notifications, setNotifications] = useState<AccountNotifications[]>(
    [],
  );

  const notificationCount = getNotificationCount(notifications);

  const hasNotifications = useMemo(
    () => notificationCount > 0,
    [notificationCount],
  );

  const hasMoreAccountNotifications = useMemo(
    () => hasMoreNotifications(notifications),
    [notifications],
  );

  const removeAccountNotifications = useCallback(
    async (account: Account) => {
      setStatus('loading');

      const updatedNotifications = notifications.filter(
        (notification) => notification.account !== account,
      );

      setNotifications(updatedNotifications);

      setStatus('success');
    },
    [notifications],
  );

  const isFetchingRef = useRef(false);
  const fetchNotifications = useCallback(
    async (state: AtlassifyState) => {
      if (isFetchingRef.current) {
        // Prevent overlapping fetches
        return;
      }
      isFetchingRef.current = true;
      setStatus('loading');

      try {
        const previousNotifications = notifications;
        const fetchedNotifications = await getAllNotifications(state);
        setNotifications(fetchedNotifications);

        // Set Global Error if all accounts have the same error
        const allAccountsHaveErrors =
          doesAllAccountsHaveErrors(fetchedNotifications);
        const allAccountErrorsAreSame =
          areAllAccountErrorsSame(fetchedNotifications);

        if (allAccountsHaveErrors) {
          const accountError = fetchedNotifications[0].error;
          setStatus('error');
          setGlobalError(allAccountErrorsAreSame ? accountError : null);
          return;
        }

        const diffNotifications = getNewNotifications(
          previousNotifications,
          fetchedNotifications,
        );

        if (diffNotifications.length > 0) {
          if (state.settings.playSoundNewNotifications) {
            raiseSoundNotification(state.settings.notificationVolume);
          }

          if (state.settings.showSystemNotifications) {
            raiseNativeNotification(diffNotifications);
          }
        }

        setStatus('success');
        setGlobalError(null);
      } finally {
        isFetchingRef.current = false;
      }
    },
    [notifications],
  );

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

  const markNotificationsRead = useCallback(
    async (
      state: AtlassifyState,
      readNotifications: AtlassifyNotification[],
    ) => {
      setStatus('loading');
      trackEvent('action', { name: 'Mark as Read' });

      const account = readNotifications[0].account;

      const singleGroupNotifications = readNotifications.filter(
        (notification) => !isGroupNotification(notification),
      );
      const singleNotificationIDs = singleGroupNotifications.map(
        (notification) => notification.id,
      );

      try {
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

        setNotifications(updatedNotifications);
      } catch (err) {
        rendererLogError(
          'markNotificationsRead',
          'Error occurred while marking notifications as read',
          err,
        );
      }

      setStatus('success');
    },
    [notifications, getNotificationIdsForGroups],
  );

  const markNotificationsUnread = useCallback(
    async (
      state: AtlassifyState,
      unreadNotifications: AtlassifyNotification[],
    ) => {
      setStatus('loading');
      trackEvent('action', { name: 'Mark as Unread' });

      const account = unreadNotifications[0].account;

      const singleGroupNotifications = unreadNotifications.filter(
        (notification) => !isGroupNotification(notification),
      );
      const singleNotificationIDs = singleGroupNotifications.map(
        (notification) => notification.id,
      );

      try {
        const groupedNotificationIds = await getNotificationIdsForGroups(
          state,
          unreadNotifications,
        );

        singleNotificationIDs.push(...groupedNotificationIds);

        await markNotificationsAsUnread(account, singleNotificationIDs);

        for (const notification of unreadNotifications) {
          notification.readState = 'unread';
        }
      } catch (err) {
        rendererLogError(
          'markNotificationsUnread',
          'Error occurred while marking notifications as unread',
          err,
        );
      }

      setStatus('success');
    },
    [getNotificationIdsForGroups],
  );

  return {
    status,
    globalError,

    notifications,
    notificationCount,
    hasNotifications,
    hasMoreAccountNotifications,

    fetchNotifications,
    removeAccountNotifications,

    markNotificationsRead,
    markNotificationsUnread,
  };
};
