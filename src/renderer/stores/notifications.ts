import { create } from 'zustand';

import type {
  Account,
  AccountNotifications,
  AtlassifyNotification,
  AtlassifyState,
  SettingsState,
  Status,
} from '../types';

import { updateNotificationReadState } from '../utils/api/client';
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
} from '../utils/notifications/notifications';
import { raiseSoundNotification } from '../utils/notifications/sound';
import { getNewNotifications } from '../utils/notifications/utils';

// Helper to trigger side effects for new notifications
function triggerNotificationSideEffects(
  newNotifications: AtlassifyNotification[],
  settings: SettingsState,
) {
  if (newNotifications.length === 0) {
    return;
  }

  if (settings.playSoundNewNotifications) {
    raiseSoundNotification(settings.notificationVolume);
  }

  if (settings.showSystemNotifications) {
    raiseNativeNotification(newNotifications);
  }
}

export interface NotificationsState {
  allNotifications: AccountNotifications[];
  fetchStatus: Status;
}

const initialState: NotificationsState = {
  allNotifications: [],
  fetchStatus: 'success',
};

export interface NotificationActions {
  fetchNotifications: (state: AtlassifyState) => Promise<void>;
  markNotificationsRead: (
    state: AtlassifyState,
    notifications: AtlassifyNotification[],
  ) => Promise<void>;
  markNotificationsUnread: (
    state: AtlassifyState,
    notifications: AtlassifyNotification[],
  ) => Promise<void>;
  removeAccountNotifications: (account: Account) => Promise<void>;
  reset: () => void;
}

export const useNotificationsStore = create<
  NotificationsState & NotificationActions
>((set, get) => ({
  ...initialState,

  fetchNotifications: async (state: AtlassifyState) => {
    if (get().fetchStatus === 'loading') {
      // Prevent overlapping fetches
      return;
    }

    set({ fetchStatus: 'loading' });

    const previousNotifications = get().allNotifications;
    const fetchedNotifications = await getAllNotifications(state);

    set({ allNotifications: fetchedNotifications });

    // Check if all accounts have errors
    if (doesAllAccountsHaveErrors(fetchedNotifications)) {
      set({ fetchStatus: 'error' });
      return;
    }

    // Trigger side effects for new notifications
    const diffNotifications = getNewNotifications(
      previousNotifications,
      fetchedNotifications,
    );
    triggerNotificationSideEffects(diffNotifications, state.settings);

    set({ fetchStatus: 'success' });
  },

  markNotificationsRead: async (
    state: AtlassifyState,
    readNotifications: AtlassifyNotification[],
  ) => {
    const account = readNotifications[0].account;

    set({ fetchStatus: 'loading' });
    trackEvent('Action', { name: 'Mark as Read' });

    try {
      await updateNotificationReadState(
        account,
        state.settings,
        readNotifications,
        'read',
      );

      const notificationIDsToMark = new Set(readNotifications.map((n) => n.id));

      set((currentState) => ({
        allNotifications: currentState.allNotifications.map(
          (accountNotifications) =>
            accountNotifications.account.id === account.id
              ? {
                  ...accountNotifications,
                  notifications: accountNotifications.notifications.map((n) =>
                    notificationIDsToMark.has(n.id)
                      ? { ...n, readState: 'read' }
                      : n,
                  ),
                }
              : accountNotifications,
        ),
      }));

      set({ fetchStatus: 'success' });
    } catch (err) {
      rendererLogError(
        'markNotificationsRead',
        'Error occurred while marking notifications as read',
        err,
      );
      set({ fetchStatus: 'error' });
    }
  },

  markNotificationsUnread: async (
    state: AtlassifyState,
    unreadNotifications: AtlassifyNotification[],
  ) => {
    const account = unreadNotifications[0].account;

    set({ fetchStatus: 'loading' });
    trackEvent('Action', { name: 'Mark as Unread' });

    try {
      await updateNotificationReadState(
        account,
        state.settings,
        unreadNotifications,
        'unread',
      );

      const notificationIDsToMark = new Set(
        unreadNotifications.map((n) => n.id),
      );

      set((currentState) => ({
        allNotifications: currentState.allNotifications.map(
          (accountNotifications) =>
            accountNotifications.account.id === account.id
              ? {
                  ...accountNotifications,
                  notifications: accountNotifications.notifications.map((n) =>
                    notificationIDsToMark.has(n.id)
                      ? { ...n, readState: 'unread' }
                      : n,
                  ),
                }
              : accountNotifications,
        ),
      }));

      set({ fetchStatus: 'success' });
    } catch (err) {
      rendererLogError(
        'markNotificationsUnread',
        'Error occurred while marking notifications as unread',
        err,
      );
      set({ fetchStatus: 'error' });
    }
  },

  removeAccountNotifications: async (account: Account) => {
    set({ fetchStatus: 'loading' });
    trackEvent('Action', { name: 'Remove Account' });

    const updatedNotifications = get().allNotifications.filter(
      (notification) => notification.account !== account,
    );

    set({ allNotifications: updatedNotifications, fetchStatus: 'success' });
  },

  reset: () => {
    set(initialState);
  },
}));

/**
 * Derived state selectors
 */

// Get total count of all notifications (regardless of filters)
export const selectAllNotificationsCount = (state: NotificationsState) =>
  state.allNotifications.reduce(
    (total, acc) => total + acc.notifications.length,
    0,
  );

// Get visible notifications as AccountNotifications[] based on settings
export const selectVisibleNotifications = (
  state: NotificationsState,
  settings: SettingsState,
): AccountNotifications[] =>
  state.allNotifications.map((accountNotifications) => ({
    ...accountNotifications,
    notifications: filterVisibleNotifications(
      accountNotifications.notifications,
      settings,
    ),
  }));

// Get count of visible notifications based on settings
export const selectVisibleNotificationCount = (
  state: NotificationsState,
  settings: SettingsState,
) => {
  const visibleNotifications = selectVisibleNotifications(state, settings);
  return visibleNotifications.reduce(
    (total, acc) => total + acc.notifications.length,
    0,
  );
};

export const selectHasNotifications = (
  state: NotificationsState,
  settings: SettingsState,
) => selectVisibleNotificationCount(state, settings) > 0;

export const selectHasMoreAccountNotifications = (state: NotificationsState) =>
  state.allNotifications.some(
    (accountNotifications) => accountNotifications.hasMoreNotifications,
  );

// Computed selector for global error - only returns error if all accounts have the same error
export const selectGlobalError = (state: NotificationsState) => {
  const allAccountsHaveErrors = doesAllAccountsHaveErrors(
    state.allNotifications,
  );
  const allAccountErrorsAreSame = areAllAccountErrorsSame(
    state.allNotifications,
  );

  return allAccountsHaveErrors && allAccountErrorsAreSame
    ? (state.allNotifications[0]?.error ?? null)
    : null;
};
