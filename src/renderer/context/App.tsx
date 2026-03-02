import { createContext, type ReactNode, useEffect, useMemo } from 'react';

import { onlineManager } from '@tanstack/react-query';

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
  AccountNotifications,
  AtlassifyError,
  AtlassifyNotification,
} from '../types';

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
  } = useNotifications();

  const isOnline = useRuntimeStore((s) => s.isOnline);

  // Subscribe to onlineManager and write changes into the runtime store.
  useEffect(() => {
    const syncOnlineState = () => {
      useRuntimeStore.getState().updateIsOnline(onlineManager.isOnline());
    };
    const unsubscribe = onlineManager.subscribe(syncOnlineState);
    syncOnlineState();
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

      focusedNotificationId,
    ],
  );

  return (
    <AppContext.Provider value={contextValues}>{children}</AppContext.Provider>
  );
};
