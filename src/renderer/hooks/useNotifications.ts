import log from 'electron-log';
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
  markNotificationsAsRead,
  markNotificationsAsUnread,
} from '../utils/api/client';
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
      const allAccountsHaveErrors = fetchedNotifications.every((account) => {
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

      try {
        await markNotificationsAsRead(account, notificationIDs);

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
        log.error('Error occurred while marking notifications as read', err);
      }

      setStatus('success');
    },
    [notifications],
  );

  const markNotificationsUnread = useCallback(
    async (
      _state: AtlassifyState,
      unreadNotifications: AtlassifyNotification[],
    ) => {
      setStatus('loading');

      const account = unreadNotifications[0].account;
      const notificationIDs = unreadNotifications.map(
        (notification) => notification.id,
      );

      try {
        await markNotificationsAsUnread(account, notificationIDs);

        for (const notification of unreadNotifications) {
          notification.readState = 'unread';
        }
      } catch (err) {
        log.error('Error occurred while marking notifications as read', err);
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
