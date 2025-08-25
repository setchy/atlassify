import {
  createContext,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Constants } from '../constants';
import { useInterval } from '../hooks/useInterval';
import { useNotifications } from '../hooks/useNotifications';
import type {
  Account,
  AccountNotifications,
  AtlassifyError,
  AtlassifyNotification,
  AuthState,
  FilterSettingsState,
  FilterValue,
  SettingsState,
  SettingsValue,
  Status,
} from '../types';
import type { LoginOptions } from '../utils/auth/types';
import {
  addAccount,
  hasAccounts,
  refreshAccount,
  removeAccount,
} from '../utils/auth/utils';
import {
  setAlternateIdleIcon,
  setAutoLaunch,
  setKeyboardShortcut,
  updateTrayTitle,
} from '../utils/comms';
import {
  getNotificationCount,
  hasMoreNotifications,
} from '../utils/notifications/notifications';
import { clearState, loadState, saveState } from '../utils/storage';
import { setTheme } from '../utils/theme';
import { zoomPercentageToLevel } from '../utils/zoom';
import { defaultAuth, defaultFilters, defaultSettings } from './defaults';

interface AppContextState {
  auth: AuthState;
  isLoggedIn: boolean;
  login: (data: LoginOptions) => Promise<void>;
  logoutFromAccount: (account: Account) => void;

  status: Status;
  globalError: AtlassifyError;

  notifications: AccountNotifications[];
  fetchNotifications: () => Promise<void>;
  removeAccountNotifications: (account: Account) => Promise<void>;

  markNotificationsRead: (
    notifications: AtlassifyNotification[],
  ) => Promise<void>;
  markNotificationsUnread: (
    notifications: AtlassifyNotification[],
  ) => Promise<void>;

  settings: SettingsState;
  clearFilters: () => void;
  resetSettings: () => void;
  updateSetting: (name: keyof SettingsState, value: SettingsValue) => void;
  updateFilter: (
    name: keyof FilterSettingsState,
    value: FilterValue,
    checked: boolean,
  ) => void;
}

export const AppContext = createContext<Partial<AppContextState>>({});

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>(defaultAuth);
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const {
    notifications,
    fetchNotifications,
    removeAccountNotifications,
    status,
    globalError,
    markNotificationsRead,
    markNotificationsUnread,
  } = useNotifications();

  // Run once on mount to restore settings/state
  // biome-ignore lint/correctness/useExhaustiveDependencies: restoreSettings is stable and should run only once
  useEffect(() => {
    restoreSettings();
  }, []);

  useEffect(() => {
    setTheme(settings.theme);
  }, [settings.theme]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: We only want fetchNotifications to be called for particular state changes
  useEffect(() => {
    fetchNotifications({ auth, settings });
  }, [
    auth.accounts,
    settings.fetchOnlyUnreadNotifications,
    settings.groupNotificationsByTitle,
    settings.filterTimeSensitive,
    settings.filterCategories,
    settings.filterReadStates,
    settings.filterProducts,
  ]);

  useInterval(() => {
    fetchNotifications({ auth, settings });
  }, Constants.FETCH_NOTIFICATIONS_INTERVAL_MS);

  useInterval(() => {
    for (const account of auth.accounts) {
      refreshAccount(account);
    }
  }, Constants.REFRESH_ACCOUNTS_INTERVAL_MS);

  useEffect(() => {
    const count = getNotificationCount(notifications);
    const hasMore = hasMoreNotifications(notifications);

    if (settings.showNotificationsCountInTray && count > 0) {
      updateTrayTitle(`${count.toString()}${hasMore ? '+' : ''}`);
    } else {
      updateTrayTitle();
    }
  }, [settings.showNotificationsCountInTray, notifications]);

  useEffect(() => {
    setKeyboardShortcut(settings.keyboardShortcutEnabled);
  }, [settings.keyboardShortcutEnabled]);

  useEffect(() => {
    window.atlassify.onResetApp(() => {
      clearState();
      setAuth(defaultAuth);
      setSettings(defaultSettings);
    });
  }, []);

  const clearFilters = useCallback(() => {
    const newSettings = { ...settings, ...defaultFilters };
    setSettings(newSettings);
    saveState({ auth, settings: newSettings });
  }, [auth, settings]);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    saveState({ auth, settings: defaultSettings });
  }, [auth]);

  const updateSetting = useCallback(
    (name: keyof SettingsState, value: SettingsValue) => {
      if (name === 'openAtStartup') {
        setAutoLaunch(value as boolean);
      }
      if (name === 'useAlternateIdleIcon') {
        setAlternateIdleIcon(value as boolean);
      }

      const newSettings = { ...settings, [name]: value };
      setSettings(newSettings);
      saveState({ auth, settings: newSettings });
    },
    [auth, settings],
  );

  const updateFilter = useCallback(
    (name: keyof FilterSettingsState, value: FilterValue, checked: boolean) => {
      const updatedFilters = checked
        ? [...settings[name], value]
        : settings[name].filter((item) => item !== value);

      updateSetting(name, updatedFilters);
    },
    [updateSetting, settings],
  );

  const isLoggedIn = useMemo(() => {
    return hasAccounts(auth);
  }, [auth]);

  const login = useCallback(
    async ({ username, token }: LoginOptions) => {
      const updatedAuth = await addAccount(auth, username, token);
      setAuth(updatedAuth);
      saveState({ auth: updatedAuth, settings });
    },
    [auth, settings],
  );

  const logoutFromAccount = useCallback(
    async (account: Account) => {
      // Remove notifications for account
      removeAccountNotifications(account);

      // Remove from auth state
      const updatedAuth = removeAccount(auth, account);
      setAuth(updatedAuth);
      saveState({ auth: updatedAuth, settings });
    },
    [auth, settings, removeAccountNotifications],
  );

  const restoreSettings = useCallback(async () => {
    const existing = loadState();

    // Restore settings before accounts to ensure filters are available before fetching notifications
    if (existing.settings) {
      setKeyboardShortcut(existing.settings.keyboardShortcutEnabled);
      setAlternateIdleIcon(existing.settings.useAlternateIdleIcon);
      setSettings({ ...defaultSettings, ...existing.settings });
      window.atlassify.zoom.setLevel(
        zoomPercentageToLevel(existing.settings.zoomPercentage),
      );
    }

    if (existing.auth) {
      setAuth({ ...defaultAuth, ...existing.auth });

      // Refresh account data on app start
      for (const account of existing.auth.accounts) {
        await refreshAccount(account);
      }
    }
  }, []);

  const fetchNotificationsWithAccounts = useCallback(
    async () => await fetchNotifications({ auth, settings }),
    [auth, settings, fetchNotifications],
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

  const contextValues = useMemo(
    () => ({
      auth,
      isLoggedIn,
      login,
      logoutFromAccount,

      status,
      globalError,

      notifications,
      fetchNotifications: fetchNotificationsWithAccounts,

      markNotificationsRead: markNotificationsReadWithAccounts,
      markNotificationsUnread: markNotificationsUnreadWithAccounts,

      settings,
      clearFilters,
      resetSettings,
      updateSetting,
      updateFilter,
    }),
    [
      auth,
      isLoggedIn,
      login,
      logoutFromAccount,

      status,
      globalError,

      notifications,
      fetchNotificationsWithAccounts,

      markNotificationsReadWithAccounts,
      markNotificationsUnreadWithAccounts,

      settings,
      clearFilters,
      resetSettings,
      updateSetting,
      updateFilter,
    ],
  );

  return (
    <AppContext.Provider value={contextValues}>{children}</AppContext.Provider>
  );
};
