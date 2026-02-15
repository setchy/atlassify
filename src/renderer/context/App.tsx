import {
  createContext,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { onlineManager } from '@tanstack/react-query';

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

  isOnline: boolean;
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

  const [isOnline, setIsOnline] = useState(false);

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
  const { focusedNotificationId } = useKeyboardNavigation({
    notifications,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: We want to update the tray on setting or notification changes
  useEffect(() => {
    const trayCount = status === 'error' ? -1 : notificationCount;
    setTrayIconColorAndTitle(trayCount, hasMoreAccountNotifications, isOnline);
  }, [
    showNotificationsCountInTray,
    useUnreadActiveIcon,
    useAlternateIdleIcon,
    status,
    notificationCount,
    hasMoreAccountNotifications,
    isOnline,
  ]);

  useEffect(() => {
    window.atlassify.onResetApp(() => {
      resetAccounts();
      useSettingsStore.getState().reset();
      resetFilters();
    });
  }, [resetAccounts, resetFilters]);

  // Online / Offline status monitoring via TanStack Query onlineManager
  useEffect(() => {
    const handle = () => {
      try {
        const online = onlineManager.isOnline();

        setIsOnline(online);
      } catch (_err) {
        // ignore
      }
    };

    // Subscribe and call immediately to set initial status
    const unsubscribe = onlineManager.subscribe(handle);
    handle();

    return () => unsubscribe();
  }, []);

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

      isOnline,
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

      isOnline,
    ],
  );

  return (
    <AppContext.Provider value={contextValues}>{children}</AppContext.Provider>
  );
};
