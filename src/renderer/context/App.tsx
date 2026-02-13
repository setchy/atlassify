import { createContext, type ReactNode, useEffect, useMemo } from 'react';

import { useAccounts } from '../hooks/useAccounts';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { useNotifications } from '../hooks/useNotifications';
import useAccountsStore from '../stores/useAccountsStore';
import useFiltersStore from '../stores/useFiltersStore';
import useSettingsStore from '../stores/useSettingsStore';

import type {
  AccountNotifications,
  AtlassifyError,
  AtlassifyNotification,
  Status,
} from '../types';

import { setTrayIconColorAndTitle } from '../utils/tray';

export interface AppContextState {
  status: Status;
  globalError: AtlassifyError;

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
  focusNotification: (notificationId: string | null) => void;
}

export const AppContext = createContext<Partial<AppContextState> | undefined>(
  undefined,
);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Get store actions and reset functions
  const resetFilters = useFiltersStore((s) => s.reset);
  const resetAccounts = useAccountsStore((s) => s.reset);

  // Read accounts from store
  const accounts = useAccountsStore((state) => state.accounts);

  // Subscribe to tray-related settings for useEffect dependencies
  const showNotificationsCountInTray = useSettingsStore(
    (s) => s.showNotificationsCountInTray,
  );
  const useUnreadActiveIcon = useSettingsStore((s) => s.useUnreadActiveIcon);
  const useAlternateIdleIcon = useSettingsStore((s) => s.useAlternateIdleIcon);

  const {
    status,
    globalError,

    notifications,
    notificationCount,
    hasNotifications,
    hasMoreAccountNotifications,

    refetchNotifications,

    markNotificationsRead,
    markNotificationsUnread,
  } = useNotifications(accounts);

  // Periodic account refreshes
  useAccounts(accounts);

  // Keyboard navigation
  const { focusedNotificationId, focusNotification } = useKeyboardNavigation({
    notifications,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: We want to update the tray on setting or notification changes
  useEffect(() => {
    const trayCount = status === 'error' ? -1 : notificationCount;
    setTrayIconColorAndTitle(trayCount, hasMoreAccountNotifications);
  }, [
    showNotificationsCountInTray,
    useUnreadActiveIcon,
    useAlternateIdleIcon,
    status,
    notificationCount,
    hasMoreAccountNotifications,
  ]);

  useEffect(() => {
    window.atlassify.onResetApp(() => {
      resetAccounts();
      useSettingsStore.getState().reset();
      resetFilters();
    });
  }, [resetAccounts, resetFilters]);

  const contextValues: AppContextState = useMemo(
    () => ({
      status,
      globalError,

      notifications,
      notificationCount,
      hasNotifications,
      hasMoreAccountNotifications,

      fetchNotifications: refetchNotifications,

      markNotificationsRead,
      markNotificationsUnread,

      focusedNotificationId,
      focusNotification,
    }),
    [
      status,
      globalError,

      notifications,
      notificationCount,
      hasNotifications,
      hasMoreAccountNotifications,

      refetchNotifications,

      markNotificationsRead,
      markNotificationsUnread,

      focusedNotificationId,
      focusNotification,
    ],
  );

  return (
    <AppContext.Provider value={contextValues}>{children}</AppContext.Provider>
  );
};
