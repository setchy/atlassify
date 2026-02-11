import {
  createContext,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
} from 'react';

import { useAccounts } from '../hooks/useAccounts';
import { useNotifications } from '../hooks/useNotifications';

import type {
  Account,
  AccountNotifications,
  AtlassifyError,
  AtlassifyNotification,
  AuthState,
  SettingsState,
  SettingsValue,
  Status,
} from '../types';
import type { LoginOptions } from '../utils/auth/types';

import useAccountsStore from '../stores/useAccountsStore';
import useFiltersStore from '../stores/useFiltersStore';
import useSettingsStore from '../stores/useSettingsStore';
import { addAccount, hasAccounts, removeAccount } from '../utils/auth/utils';
import { setTrayIconColorAndTitle } from '../utils/tray';

export interface AppContextState {
  auth: AuthState;
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

  settings: SettingsState;
  resetSettings: () => void;
  updateSetting: (name: keyof SettingsState, value: SettingsValue) => void;
}

export const AppContext = createContext<Partial<AppContextState> | undefined>(
  undefined,
);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Get store actions and reset functions
  const resetFilters = useFiltersStore((s) => s.reset);
  const resetAccounts = useAccountsStore((s) => s.reset);
  const resetSettings = useSettingsStore((s) => s.reset);

  // Read accounts from store
  const accounts = useAccountsStore((state) => state.accounts);
  const auth = useMemo<AuthState>(() => ({ accounts }), [accounts]);

  // Subscribe to all settings values individually to avoid creating new objects
  const language = useSettingsStore((s) => s.language);
  const theme = useSettingsStore((s) => s.theme);
  const zoomPercentage = useSettingsStore((s) => s.zoomPercentage);
  const markAsReadOnOpen = useSettingsStore((s) => s.markAsReadOnOpen);
  const delayNotificationState = useSettingsStore(
    (s) => s.delayNotificationState,
  );
  const fetchOnlyUnreadNotifications = useSettingsStore(
    (s) => s.fetchOnlyUnreadNotifications,
  );
  const groupNotificationsByProduct = useSettingsStore(
    (s) => s.groupNotificationsByProduct,
  );
  const groupNotificationsByProductAlphabetically = useSettingsStore(
    (s) => s.groupNotificationsByProductAlphabetically,
  );
  const groupNotificationsByTitle = useSettingsStore(
    (s) => s.groupNotificationsByTitle,
  );
  const showNotificationsCountInTray = useSettingsStore(
    (s) => s.showNotificationsCountInTray,
  );
  const useUnreadActiveIcon = useSettingsStore((s) => s.useUnreadActiveIcon);
  const useAlternateIdleIcon = useSettingsStore((s) => s.useAlternateIdleIcon);
  const openLinks = useSettingsStore((s) => s.openLinks);
  const keyboardShortcutEnabled = useSettingsStore(
    (s) => s.keyboardShortcutEnabled,
  );
  const showSystemNotifications = useSettingsStore(
    (s) => s.showSystemNotifications,
  );
  const playSoundNewNotifications = useSettingsStore(
    (s) => s.playSoundNewNotifications,
  );
  const notificationVolume = useSettingsStore((s) => s.notificationVolume);
  const openAtStartup = useSettingsStore((s) => s.openAtStartup);

  const settings = useMemo<SettingsState>(
    () => ({
      language,
      theme,
      zoomPercentage,
      markAsReadOnOpen,
      delayNotificationState,
      fetchOnlyUnreadNotifications,
      groupNotificationsByProduct,
      groupNotificationsByProductAlphabetically,
      groupNotificationsByTitle,
      showNotificationsCountInTray,
      useUnreadActiveIcon,
      useAlternateIdleIcon,
      openLinks,
      keyboardShortcutEnabled,
      showSystemNotifications,
      playSoundNewNotifications,
      notificationVolume,
      openAtStartup,
    }),
    [
      language,
      theme,
      zoomPercentage,
      markAsReadOnOpen,
      delayNotificationState,
      fetchOnlyUnreadNotifications,
      groupNotificationsByProduct,
      groupNotificationsByProductAlphabetically,
      groupNotificationsByTitle,
      showNotificationsCountInTray,
      useUnreadActiveIcon,
      useAlternateIdleIcon,
      openLinks,
      keyboardShortcutEnabled,
      showSystemNotifications,
      playSoundNewNotifications,
      notificationVolume,
      openAtStartup,
    ],
  );

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
  } = useNotifications({ auth, settings });

  useAccounts(auth.accounts);

  // biome-ignore lint/correctness/useExhaustiveDependencies: We want to update the tray on setting or notification changes
  useEffect(() => {
    const trayCount = status === 'error' ? -1 : notificationCount;
    setTrayIconColorAndTitle(trayCount, hasMoreAccountNotifications, settings);
  }, [
    showNotificationsCountInTray,
    useUnreadActiveIcon,
    useAlternateIdleIcon,
    notifications,
  ]);

  useEffect(() => {
    window.atlassify.onResetApp(() => {
      resetAccounts();
      resetSettings();
      resetFilters();
    });
  }, [resetAccounts, resetSettings, resetFilters]);

  const handleResetSettings = useCallback(() => {
    resetSettings();
  }, [resetSettings]);

  const handleUpdateSetting = useCallback(
    (name: keyof SettingsState, value: SettingsValue) => {
      useSettingsStore.getState().updateSetting(name, value);
    },
    [],
  );

  const isLoggedIn = useMemo(() => {
    return hasAccounts(auth);
  }, [auth]);

  const login = useCallback(
    async ({ username, token }: LoginOptions) => {
      const updatedAuth = await addAccount(auth, username, token);
      useAccountsStore.getState().setAccounts(updatedAuth.accounts);
    },
    [auth],
  );

  const logoutFromAccount = useCallback(
    async (account: Account) => {
      const updatedAuth = removeAccount(auth, account);
      useAccountsStore.getState().setAccounts(updatedAuth.accounts);
    },
    [auth],
  );

  const fetchNotificationsWithAccounts = useCallback(
    async () => await refetchNotifications(),
    [refetchNotifications],
  );

  const markNotificationsReadWithAccounts = useCallback(
    async (notifications: AtlassifyNotification[]) =>
      await markNotificationsRead({ auth, settings }, notifications),
    [auth, settings, markNotificationsRead],
  );

  const markNotificationsUnreadWithAccounts = useCallback(
    async (notifications: AtlassifyNotification[]) =>
      await markNotificationsUnread({ auth, settings }, notifications),
    [auth, settings, markNotificationsUnread],
  );

  const contextValues: AppContextState = useMemo(
    () => ({
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

      fetchNotifications: fetchNotificationsWithAccounts,

      markNotificationsRead: markNotificationsReadWithAccounts,
      markNotificationsUnread: markNotificationsUnreadWithAccounts,

      settings,
      resetSettings: handleResetSettings,
      updateSetting: handleUpdateSetting,
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

      settings,
      handleResetSettings,
      handleUpdateSetting,
    ],
  );

  return (
    <AppContext.Provider value={contextValues}>{children}</AppContext.Provider>
  );
};
