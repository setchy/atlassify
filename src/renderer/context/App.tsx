import {
  createContext,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
} from 'react';

import { useAccounts } from '../hooks/useAccounts';
import { useNotifications } from '../hooks/useNotifications';
import type { AccountsState, SettingsState } from '../stores/types';
import useAccountsStore from '../stores/useAccountsStore';
import useFiltersStore from '../stores/useFiltersStore';
import useSettingsStore from '../stores/useSettingsStore';

import type {
  Account,
  AccountNotifications,
  AtlassifyError,
  AtlassifyNotification,
  Status,
} from '../types';
import type { LoginOptions } from '../utils/auth/types';

import { setTrayIconColorAndTitle } from '../utils/tray';

export interface AppContextState {
  auth: AccountsState;
  isLoggedIn: boolean;
  login: (data: LoginOptions) => Promise<void>;
  logoutFromAccount: (account: Account) => void;

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
}

export const AppContext = createContext<Partial<AppContextState> | undefined>(
  undefined,
);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Get store actions and reset functions
  const resetFilters = useFiltersStore((s) => s.reset);
  const resetAccounts = useAccountsStore((s) => s.reset);
  const isLoggedIn = useAccountsStore((s) => s.isLoggedIn);
  const createAccount = useAccountsStore((s) => s.createAccount);
  const removeAccount = useAccountsStore((s) => s.removeAccount);

  // Read accounts from store
  const accounts = useAccountsStore((state) => state.accounts);
  const auth = useMemo<AccountsState>(() => ({ accounts }), [accounts]);

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
  } = useNotifications(auth);

  useAccounts(auth.accounts);

  // biome-ignore lint/correctness/useExhaustiveDependencies: We want to update the tray on setting or notification changes
  useEffect(() => {
    const trayCount = status === 'error' ? -1 : notificationCount;
    setTrayIconColorAndTitle(trayCount, hasMoreAccountNotifications);
  }, [
    showNotificationsCountInTray,
    useUnreadActiveIcon,
    useAlternateIdleIcon,
    notifications,
  ]);

  useEffect(() => {
    window.atlassify.onResetApp(() => {
      resetAccounts();
      useSettingsStore.getState().reset();
      resetFilters();
    });
  }, [resetAccounts, resetFilters]);

  const login = useCallback(
    async ({ username, token }: LoginOptions) => {
      await createAccount(username, token);
    },
    [createAccount],
  );

  const logoutFromAccount = useCallback(
    async (account: Account) => {
      removeAccount(account);
    },
    [removeAccount],
  );

  const fetchNotificationsWithAccounts = useCallback(
    async () => await refetchNotifications(),
    [refetchNotifications],
  );

  const markNotificationsReadWithAccounts = useCallback(
    async (notifications: AtlassifyNotification[]) =>
      await markNotificationsRead(notifications),
    [markNotificationsRead],
  );

  const markNotificationsUnreadWithAccounts = useCallback(
    async (notifications: AtlassifyNotification[]) =>
      await markNotificationsUnread(notifications),
    [markNotificationsUnread],
  );

  const contextValues: AppContextState = useMemo(
    () => ({
      auth,
      isLoggedIn: isLoggedIn(),
      login,
      logoutFromAccount,

      status,
      globalError,

      notifications,
      notificationCount,
      hasNotifications,
      hasMoreAccountNotifications,

      fetchNotifications: fetchNotificationsWithAccounts,

      markNotificationsRead: markNotificationsReadWithAccounts,
      markNotificationsUnread: markNotificationsUnreadWithAccounts,
    }),
    [
      auth,
      isLoggedIn,
      login,
      logoutFromAccount,

      status,
      globalError,

      notifications,
      notificationCount,
      hasNotifications,
      hasMoreAccountNotifications,

      fetchNotificationsWithAccounts,

      markNotificationsReadWithAccounts,
      markNotificationsUnreadWithAccounts,
    ],
  );

  return (
    <AppContext.Provider value={contextValues}>{children}</AppContext.Provider>
  );
};
