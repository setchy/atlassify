import { create } from 'zustand';

import type {
  Account,
  AccountNotifications,
  AtlassifyError,
  AtlassifyNotification,
  AtlassifyState,
  SettingsState,
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
import { raiseNativeNotification } from '../utils/notifications/native';
import {
  filterVisibleNotifications,
  getAllNotifications,
  isGroupNotification,
} from '../utils/notifications/notifications';
import { raiseSoundNotification } from '../utils/notifications/sound';
import { getNewNotifications } from '../utils/notifications/utils';

// Helper to get all notification IDs including grouped notifications
async function getNotificationIds(
  account: Account,
  settings: any,
  notifications: AtlassifyNotification[],
): Promise<string[]> {
  const singleGroupNotifications = notifications.filter(
    (notification) => !isGroupNotification(notification),
  );
  const singleNotificationIDs = singleGroupNotifications.map((n) => n.id);

  const groupNotifications = notifications.filter((notification) =>
    isGroupNotification(notification),
  );

  const groupNotificationIDs: string[] = [];

  for (const group of groupNotifications) {
    try {
      const res = await getNotificationsByGroupId(
        account,
        settings,
        group.notificationGroup.id,
        group.notificationGroup.size,
      );

      const groupNotificationsList = res.data.notifications.notificationGroup
        .nodes as GroupNotificationDetailsFragment[];

      const ids = groupNotificationsList.map((n) => n.notificationId);
      groupNotificationIDs.push(...ids);
    } catch (err) {
      rendererLogError(
        'getNotificationIds',
        'Error occurred while fetching notification ids for notification groups',
        err,
      );
    }
  }

  return [...singleNotificationIDs, ...groupNotificationIDs];
}

interface NotificationsState {
  notifications: AccountNotifications[];
  status: Status;
  globalError: AtlassifyError;
  isFetching: boolean;

  // Actions
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

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  status: 'success',
  globalError: null,
  isFetching: false,

  removeAccountNotifications: async (account: Account) => {
    set({ status: 'loading' });

    const updatedNotifications = get().notifications.filter(
      (notification) => notification.account !== account,
    );

    set({ notifications: updatedNotifications, status: 'success' });
  },

  fetchNotifications: async (state: AtlassifyState) => {
    if (get().isFetching) {
      // Prevent overlapping fetches
      return;
    }

    set({ isFetching: true, status: 'loading' });

    try {
      const previousNotifications = get().notifications;
      const fetchedNotifications = await getAllNotifications(state);

      set({ notifications: fetchedNotifications });

      // Set Global Error if all accounts have the same error
      const allAccountsHaveErrors =
        doesAllAccountsHaveErrors(fetchedNotifications);
      const allAccountErrorsAreSame =
        areAllAccountErrorsSame(fetchedNotifications);

      if (allAccountsHaveErrors) {
        const accountError = fetchedNotifications[0].error;
        set({
          status: 'error',
          globalError: allAccountErrorsAreSame ? accountError : null,
          isFetching: false,
        });
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

      set({ status: 'success', globalError: null });
    } finally {
      set({ isFetching: false });
    }
  },

  markNotificationsRead: async (
    state: AtlassifyState,
    readNotifications: AtlassifyNotification[],
  ) => {
    set({ status: 'loading' });
    trackEvent('Action', { name: 'Mark as Read' });

    const account = readNotifications[0].account;

    try {
      const notificationIDs = await getNotificationIds(
        account,
        state.settings,
        readNotifications,
      );

      await markNotificationsAsRead(account, notificationIDs);

      const notificationIDsToMark = new Set(readNotifications.map((n) => n.id));

      // Update readState - UI filtering handles visibility
      set((currentState) => ({
        notifications: currentState.notifications.map((accountNotifications) =>
          accountNotifications.account.id === account.id
            ? {
                ...accountNotifications,
                notifications: accountNotifications.notifications.map((n) =>
                  notificationIDsToMark.has(n.id)
                    ? { ...n, readState: 'read' as const }
                    : n,
                ),
              }
            : accountNotifications,
        ),
      }));
    } catch (err) {
      rendererLogError(
        'markNotificationsRead',
        'Error occurred while marking notifications as read',
        err,
      );
    }

    set({ status: 'success' });
  },

  markNotificationsUnread: async (
    state: AtlassifyState,
    unreadNotifications: AtlassifyNotification[],
  ) => {
    set({ status: 'loading' });
    trackEvent('Action', { name: 'Mark as Unread' });

    const account = unreadNotifications[0].account;

    try {
      const notificationIDs = await getNotificationIds(
        account,
        state.settings,
        unreadNotifications,
      );

      await markNotificationsAsUnread(account, notificationIDs);

      const notificationIDsToMark = new Set(
        unreadNotifications.map((n) => n.id),
      );

      // Update readState - UI filtering handles visibility
      set((currentState) => ({
        notifications: currentState.notifications.map((accountNotifications) =>
          accountNotifications.account.id === account.id
            ? {
                ...accountNotifications,
                notifications: accountNotifications.notifications.map((n) =>
                  notificationIDsToMark.has(n.id)
                    ? { ...n, readState: 'unread' as const }
                    : n,
                ),
              }
            : accountNotifications,
        ),
      }));
    } catch (err) {
      rendererLogError(
        'markNotificationsUnread',
        'Error occurred while marking notifications as unread',
        err,
      );
    }

    set({ status: 'success' });
  },
}));

// Selectors for common queries
export const selectNotificationCount = (
  state: NotificationsState,
  settings: SettingsState,
) =>
  state.notifications.reduce((total, accountNotifications) => {
    const visible = filterVisibleNotifications(
      accountNotifications.notifications,
      settings,
    );
    return total + visible.length;
  }, 0);

export const selectHasNotifications = (
  state: NotificationsState,
  settings: SettingsState,
) =>
  state.notifications.some((accountNotifications) => {
    const visible = filterVisibleNotifications(
      accountNotifications.notifications,
      settings,
    );
    return visible.length > 0;
  });

export const selectHasMoreAccountNotifications = (state: NotificationsState) =>
  state.notifications.some(
    (accountNotifications) => accountNotifications.hasMoreNotifications,
  );

// Export the filter helper for use in components
export { filterVisibleNotifications };
