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
import { markNotificationsAsRead } from '../utils/api/client';
import {
  getAllNotifications,
  setTrayIconColor,
  triggerNativeNotifications,
} from '../utils/notifications';
import { removeNotification } from '../utils/remove-notification';
import { removeNotifications } from '../utils/remove-notifications';

interface NotificationsState {
  notifications: AccountNotifications[];
  removeAccountNotifications: (account: Account) => Promise<void>;
  fetchNotifications: (state: AtlassifyState) => Promise<void>;
  markNotificationRead: (
    state: AtlassifyState,
    notification: AtlassifyNotification,
  ) => Promise<void>;
  markProductNotificationsRead: (
    state: AtlassifyState,
    notification: AtlassifyNotification,
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

  const markNotificationRead = useCallback(
    async (state: AtlassifyState, notification: AtlassifyNotification) => {
      setStatus('loading');

      try {
        await markNotificationsAsRead(notification.account, [notification.id]);

        const updatedNotifications = removeNotification(
          state.settings,
          notification,
          notifications,
        );

        setNotifications(updatedNotifications);
        setTrayIconColor(updatedNotifications);
      } catch (err) {
        log.error('Error occurred while marking notification as read', err);
      }

      setStatus('success');
    },
    [notifications],
  );

  const markProductNotificationsRead = useCallback(
    async (state: AtlassifyState, notification: AtlassifyNotification) => {
      setStatus('loading');

      // const repoSlug = notification.repository.full_name;

      try {
        // await markRepositoryNotificationsAsRead(
        //   repoSlug,
        //   notification.account.token,
        // );

        const updatedNotifications = removeNotifications(
          state.settings,
          notification,
          notifications,
        );

        setNotifications(updatedNotifications);
        setTrayIconColor(updatedNotifications);
      } catch (err) {
        log.error(
          'Error occurred while marking repository notifications as read',
          err,
        );
      }

      setStatus('success');
    },
    [notifications],
  );

  return {
    status,
    globalError,
    notifications,

    removeAccountNotifications,
    fetchNotifications,
    markNotificationRead,
    markProductNotificationsRead,
  };
};
