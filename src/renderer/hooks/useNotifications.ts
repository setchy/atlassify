import { useCallback, useState } from 'react';

import { logError } from '../../shared/logger';
import type {
  Account,
  AccountNotifications,
  AtlassifyError,
  AtlassifyNotification,
  AtlassifyState,
  Status,
} from '../types';
import {
  markNotificationGroupAsRead,
  markNotificationGroupAsUnread,
  markNotificationsAsRead,
  markNotificationsAsUnread,
} from '../utils/api/client';
import { updateTrayIcon } from '../utils/comms';
import { triggerNativeNotifications } from '../utils/notifications/native';
import {
  getAllNotifications,
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
        updateTrayIcon(-1);
        return;
      }

      setNotifications(fetchedNotifications);
      triggerNativeNotifications(notifications, fetchedNotifications, state);
      setStatus('success');
    },
    [notifications],
  );

  const markNotificationsRead = useCallback(
    async (
      state: AtlassifyState,
      readNotifications: AtlassifyNotification[],
    ) => {
      setStatus('loading');

      const account = readNotifications[0].account;
      const notificationIDs = readNotifications.map(
        (notification) => notification.id,
      );
      const notificationGroupIDs = readNotifications.map(
        (notification) => notification.notificationGroup.id,
      );

      try {
        if (state.settings.groupNotificationsByTitle) {
          for (const groupID of notificationGroupIDs) {
            await markNotificationGroupAsRead(account, groupID);
          }
        } else {
          await markNotificationsAsRead(account, notificationIDs);
        }

        for (const notification of readNotifications) {
          notification.readState = 'read';
        }

        // Only remove notifications from state if we're
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
        logError(
          'markNotificationsRead',
          'Error occurred while marking notifications as read',
          err,
        );
      }

      setStatus('success');
    },
    [notifications],
  );

  const markNotificationsUnread = useCallback(
    async (
      state: AtlassifyState,
      unreadNotifications: AtlassifyNotification[],
    ) => {
      setStatus('loading');

      const account = unreadNotifications[0].account;
      const notificationIDs = unreadNotifications.map(
        (notification) => notification.id,
      );
      const notificationGroupIDs = unreadNotifications.map(
        (notification) => notification.notificationGroup.id,
      );

      try {
        if (state.settings.groupNotificationsByTitle) {
          for (const groupID of notificationGroupIDs) {
            await markNotificationGroupAsUnread(account, groupID);
          }
        } else {
          await markNotificationsAsUnread(account, notificationIDs);
        }

        for (const notification of unreadNotifications) {
          notification.readState = 'unread';
        }
      } catch (err) {
        logError(
          'markNotificationsUnread',
          'Error occurred while marking notifications as unread',
          err,
        );
      }

      setStatus('success');
    },
    [],
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
