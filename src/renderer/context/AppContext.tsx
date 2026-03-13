import { createContext, type ReactNode, useMemo } from 'react';

import { useAccounts } from '../hooks/useAccounts';
import { useAppReset } from '../hooks/useAppReset';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { useNotifications } from '../hooks/useNotifications';
import { useOnlineSync } from '../hooks/useOnlineSync';
import { useRuntimeStore } from '../stores';

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

  refreshAccounts: () => Promise<void>;
}

export const AppContext = createContext<AppContextState | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
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

  // Sync online/offline state into runtime store
  useOnlineSync();

  const isOnline = useRuntimeStore((s) => s.isOnline);

  // Periodic account refreshes
  const { refreshAccounts } = useAccounts();

  // Keyboard navigation
  const { focusedNotificationId } = useKeyboardNavigation({
    notifications,
  });

  // Full app reset via IPC
  useAppReset();

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

      refreshAccounts,
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

      refreshAccounts,
    ],
  );

  return (
    <AppContext.Provider value={contextValues}>{children}</AppContext.Provider>
  );
};
