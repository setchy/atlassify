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
import {
  useAccountsStore,
  useFiltersStore,
  useNotificationsStore,
  useSettingsStore,
} from '../stores';

import type {
  AccountNotifications,
  AtlassifyError,
  AtlassifyNotification,
  Status,
} from '../types';

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
  const resetAccounts = useAccountsStore((s) => s.reset);
  const resetFilters = useFiltersStore((s) => s.reset);
  const resetSettings = useSettingsStore((s) => s.reset);

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
  } = useNotifications();

  const [isOnline, setIsOnline] = useState(() => onlineManager.isOnline());

  // Online Manager subscription to update online status in state and notifications store
  useEffect(() => {
    const handle = () => {
      const online = onlineManager.isOnline();
      setIsOnline(online);
      useNotificationsStore.getState().updateIsOnline(online);
    };
    const unsubscribe = onlineManager.subscribe(handle);
    handle();
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
