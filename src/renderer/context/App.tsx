import { createContext, type ReactNode, useEffect, useMemo } from 'react';

import { onlineManager, type UseMutationResult } from '@tanstack/react-query';

import { useAccounts } from '../hooks/useAccounts';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { useNotifications } from '../hooks/useNotifications';
import {
  useAccountsStore,
  useFiltersStore,
  useRuntimeStore,
  useSettingsStore,
} from '../stores';

import type {
  Account,
  AccountNotifications,
  AtlassifyError,
  AtlassifyNotification,
} from '../types';

import type { NotificationActionType } from '../utils/notifications/postProcess';

export interface AppContextState {
  isOnline: boolean;
  isLoading: boolean;
  isFetching: boolean;
  isErrorOrPaused: boolean;

  globalError: AtlassifyError | null;

  notifications: AccountNotifications[];
  notificationCount: number;
  hasNotifications: boolean;
  hasMoreAccountNotifications: boolean;

  fetchNotifications: () => Promise<void>;

  markNotificationsRead: (
    notifications: AtlassifyNotification[],
  ) => Promise<void>;
  markNotificationsUnread: (
    notifications: AtlassifyNotification[],
  ) => Promise<void>;

  markAsMutation: UseMutationResult<
    {
      account: Account;
      targetNotifications: AtlassifyNotification[];
      action: NotificationActionType;
    },
    Error,
    {
      targetNotifications: AtlassifyNotification[];
      action: NotificationActionType;
    }
  >;

  focusedNotificationId: string | null;
}

export const AppContext = createContext<Partial<AppContextState> | undefined>(
  undefined,
);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Get store actions and reset functions
  const resetAccounts = useAccountsStore((s) => s.reset);
  const resetFilters = useFiltersStore((s) => s.reset);
  const resetSettings = useSettingsStore((s) => s.reset);

  const {
    isLoading,
    isFetching,
    isErrorOrPaused,

    globalError,

    notifications,
    notificationCount,
    hasNotifications,
    hasMoreAccountNotifications,

    refetchNotifications,

    markNotificationsRead,
    markNotificationsUnread,

    markAsMutation,
  } = useNotifications();

  const isOnline = useRuntimeStore((s) => s.isOnline);

  // Subscribe to onlineManager and write changes into the runtime store.
  useEffect(() => {
    const syncOnlineState = () => {
      useRuntimeStore.getState().updateIsOnline(onlineManager.isOnline());
    };
    const unsubscribe = onlineManager.subscribe(syncOnlineState);

    /**
     * onlineManager initializes #online = true regardless of actual network state.
     * it only corrects itself when the first online/offline window event fires.
     * Calling setOnline(navigator.onLine) syncs its internal flag so
     * that future online→offline→online transitions are detected correctly.
     */
    onlineManager.setOnline(navigator.onLine);

    return () => unsubscribe();
  }, []);

  // Periodic account refreshes
  useAccounts();

  // Keyboard navigation
  const { focusedNotificationId } = useKeyboardNavigation({
    notifications,
  });

  useEffect(() => {
    window.atlassify.onResetApp(() => {
      resetAccounts();
      resetSettings();
      resetFilters();
    });
  }, [resetAccounts, resetSettings, resetFilters]);

  const contextValues: AppContextState = useMemo(
    () => ({
      isOnline,
      isLoading,
      isFetching,
      isErrorOrPaused,

      globalError,

      notifications,
      notificationCount,
      hasNotifications,
      hasMoreAccountNotifications,

      fetchNotifications: refetchNotifications,

      markNotificationsRead,
      markNotificationsUnread,

      markAsMutation,

      focusedNotificationId,
    }),
    [
      isOnline,
      isLoading,
      isFetching,
      isErrorOrPaused,

      globalError,

      notifications,
      notificationCount,
      hasNotifications,
      hasMoreAccountNotifications,

      refetchNotifications,

      markNotificationsRead,
      markNotificationsUnread,

      markAsMutation,

      focusedNotificationId,
    ],
  );

  return (
    <AppContext.Provider value={contextValues}>{children}</AppContext.Provider>
  );
};
