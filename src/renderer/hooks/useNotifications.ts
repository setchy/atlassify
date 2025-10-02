import { useCallback, useState } from 'react';

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
import { updateTrayColor } from '../utils/comms';
import { rendererLogError } from '../utils/logger';
import { triggerNativeNotifications } from '../utils/notifications/native';
import {
  getAllNotifications,
  isGroupNotification,
  setTrayIconColor,
} from '../utils/notifications/notifications';
import { removeNotifications } from '../utils/notifications/remove';

interface NotificationsState {
  notifications: AccountNotifications[];
  removeAccountNotifications: (account: Account) => Promise<void>;
  fetchNotifications: (state: AtlassifyState) => Promise<void>;
  markNotificationsRead: (
    state: AtlassifyState,
    notifications: AtlassifyNotification[],
  ) => Promise<void>;
  markNotificationsUnread: (
    state: AtlassifyState,
    notifications: AtlassifyNotification[],
  ) => Promise<void>;
  status: Status;
  globalError: AtlassifyError;
}

export const useNotifications = (): NotificationsState => {
  const [status, setStatus] = useState<Status>('success');
  const [globalError, setGlobalError] = useState<AtlassifyError>();

  const [notifications, setNotifications] = useState<AccountNotifications[]>(
    [],
  );

  const removeAccountNotifications = useCallback(
    async (account: Account) => {
      setStatus('loading');

      const updatedNotifications = notifications.filter(
        (notification) => notification.account !== account,
      );

      setNotifications(updatedNotifications);
      setTrayIconColor(updatedNotifications);
      setStatus('success');
    },
    [notifications],
  );

  const fetchNotifications = useCallback(
    async (state: AtlassifyState) => {
      setStatus('loading');
      setGlobalError(null);

      const fetchedNotifications = await getAllNotifications(state);

      // Set Global Error if all accounts have the same error
      const allAccountsHaveErrors =
        fetchedNotifications.length > 0 &&
        fetchedNotifications.every((account) => {
          return account.error !== null;
        });

      let accountErrorsAreAllSame = true;
      const accountError = fetchedNotifications[0]?.error;

      for (const fetchedNotification of fetchedNotifications) {
        if (accountError !== fetchedNotification.error) {
          accountErrorsAreAllSame = false;
          break;
        }
      }

      if (allAccountsHaveErrors) {
        setStatus('error');
        setGlobalError(accountErrorsAreAllSame ? accountError : null);
        updateTrayColor(-1);
        return;
      }

      setNotifications(fetchedNotifications);
      triggerNativeNotifications(notifications, fetchedNotifications, state);
      setStatus('success');
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

        // Only remove notifications from state if we're fetching only unread notifications
        if (state.settings.fetchOnlyUnreadNotifications) {
          const updatedNotifications = removeNotifications(
            state.settings,
            readNotifications,
            notifications,
          );

          setNotifications(updatedNotifications);
          setTrayIconColor(updatedNotifications);
        }
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

    removeAccountNotifications,
    fetchNotifications,
    markNotificationsRead,
    markNotificationsUnread,
  };
};
