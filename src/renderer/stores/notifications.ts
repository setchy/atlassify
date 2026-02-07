import { create } from 'zustand';

import type {
  Account,
  AccountNotifications,
  AtlassifyNotification,
  AtlassifyState,
  ReadStateType,
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

interface NotificationsState {
  notifications: AccountNotifications[];
  status: Status;
  isFetching: boolean;
}

interface NotificationActions {
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

export const useNotificationsStore = create<
  NotificationsState & NotificationActions
>((set, get) => ({
  notifications: [],
  status: 'success',
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

      // Check if all accounts have errors
      if (doesAllAccountsHaveErrors(fetchedNotifications)) {
        set({ status: 'error', isFetching: false });
        return;
      }

      // Trigger side effects for new notifications
      const diffNotifications = getNewNotifications(
        previousNotifications,
        fetchedNotifications,
      );
      triggerNotificationSideEffects(diffNotifications, state.settings);

      set({ status: 'success' });
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

    await updateNotificationReadState(state, readNotifications, 'read', set);

    set({ status: 'success' });
  },

  markNotificationsUnread: async (
    state: AtlassifyState,
    unreadNotifications: AtlassifyNotification[],
  ) => {
    set({ status: 'loading' });
    trackEvent('Action', { name: 'Mark as Unread' });

    await updateNotificationReadState(
      state,
      unreadNotifications,
      'unread',
      set,
    );

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

// Computed selector for global error - only returns error if all accounts have the same error
export const selectGlobalError = (state: NotificationsState) => {
  const allAccountsHaveErrors = doesAllAccountsHaveErrors(state.notifications);
  const allAccountErrorsAreSame = areAllAccountErrorsSame(state.notifications);

  return allAccountsHaveErrors && allAccountErrorsAreSame
    ? (state.notifications[0]?.error ?? null)
    : null;
};

// Helper to get all notification IDs including grouped notifications
async function getNotificationIds(
  account: Account,
  settings: SettingsState,
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

// Shared helper for marking notifications with a specific read state
async function updateNotificationReadState(
  state: AtlassifyState,
  notifications: AtlassifyNotification[],
  readState: ReadStateType,
  set: (fn: (state: NotificationsState) => Partial<NotificationsState>) => void,
) {
  const account = notifications[0].account;

  try {
    const notificationIDs = await getNotificationIds(
      account,
      state.settings,
      notifications,
    );

    if (readState === 'read') {
      await markNotificationsAsRead(account, notificationIDs);
    } else {
      await markNotificationsAsUnread(account, notificationIDs);
    }

    const notificationIDsToMark = new Set(notifications.map((n) => n.id));

    // Update readState - UI filtering handles visibility
    set((currentState) => ({
      notifications: currentState.notifications.map((accountNotifications) =>
        accountNotifications.account.id === account.id
          ? {
              ...accountNotifications,
              notifications: accountNotifications.notifications.map((n) =>
                notificationIDsToMark.has(n.id) ? { ...n, readState } : n,
              ),
            }
          : accountNotifications,
      ),
    }));
  } catch (err) {
    rendererLogError(
      'updateNotificationReadState',
      `Error occurred while marking notifications as ${readState}`,
      err,
    );
  }
}
