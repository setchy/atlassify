import { ipcRenderer, webFrame } from 'electron';
import {
  type ReactNode,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useInterval } from '../hooks/useInterval';
import { useNotifications } from '../hooks/useNotifications';
import {
  type Account,
  type AccountNotifications,
  type AtlasifyError,
  type AtlasifyNotification,
  type AuthState,
  GroupBy,
  OpenPreference,
  type SettingsState,
  type SettingsValue,
  type Status,
  Theme,
} from '../types';
// import type { Category, ReadState } from '../utils/api/types';
import type { LoginAPITokenOptions } from '../utils/auth/types';
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
import { Constants } from '../utils/constants';
import { getNotificationCount } from '../utils/notifications';
import { clearState, loadState, saveState } from '../utils/storage';
import { setTheme } from '../utils/theme';
import { zoomPercentageToLevel } from '../utils/zoom';

export const defaultAuth: AuthState = {
  accounts: [],
};

const defaultAppearanceSettings = {
  theme: Theme.SYSTEM,
  zoomPercentage: 100,
};

const defaultNotificationSettings = {
  groupBy: GroupBy.DATE,
  markAsReadOnOpen: true,
  delayNotificationState: false,
};

const defaultSystemSettings = {
  openLinks: OpenPreference.FOREGROUND,
  keyboardShortcut: true,
  showNotificationsCountInTray: true,
  showSystemNotifications: true,
  playSound: true,
  useAlternateIdleIcon: false,
  openAtStartup: false,
};

export const defaultFilters = {
  filterCategories: [],
  filterReadStates: [],
  filterProducts: [],
};

export const defaultSettings: SettingsState = {
  ...defaultAppearanceSettings,
  ...defaultNotificationSettings,
  ...defaultSystemSettings,
  ...defaultFilters,
};

interface AppContextState {
  auth: AuthState;
  isLoggedIn: boolean;
  loginWithAPIToken: (data: LoginAPITokenOptions) => void;
  logoutFromAccount: (account: Account) => void;

  status: Status;
  globalError: AtlasifyError;

  notifications: AccountNotifications[];
  fetchNotifications: () => Promise<void>;
  removeAccountNotifications: (account: Account) => Promise<void>;

  markNotificationRead: (notification: AtlasifyNotification) => Promise<void>;
  markNotificationUnread: (notification: AtlasifyNotification) => Promise<void>;

  markProductNotificationsRead: (
    notification: AtlasifyNotification,
  ) => Promise<void>;
  markProductNotificationsUnread: (
    notification: AtlasifyNotification,
  ) => Promise<void>;

  settings: SettingsState;
  clearFilters: () => void;
  resetSettings: () => void;
  updateSetting: (name: keyof SettingsState, value: SettingsValue) => void;
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
    markNotificationRead,
    markNotificationUnread,
    markProductNotificationsRead,
    markProductNotificationsUnread,
  } = useNotifications();
  getNotificationCount;
  useEffect(() => {
    restoreSettings();
  }, []);

  useEffect(() => {
    setTheme(settings.theme);
  }, [settings.theme]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: We only want fetchNotifications to be called for account changes
  useEffect(() => {
    fetchNotifications({ auth, settings });
  }, [auth.accounts]);

  useInterval(() => {
    fetchNotifications({ auth, settings });
  }, Constants.FETCH_NOTIFICATIONS_INTERVAL);

  useInterval(() => {
    for (const account of auth.accounts) {
      refreshAccount(account);
    }
  }, Constants.REFRESH_ACCOUNTS_INTERVAL);

  useEffect(() => {
    const count = getNotificationCount(notifications);

    if (settings.showNotificationsCountInTray && count > 0) {
      updateTrayTitle(count.toString());
    } else {
      updateTrayTitle();
    }
  }, [settings.showNotificationsCountInTray, notifications]);

  useEffect(() => {
    setKeyboardShortcut(settings.keyboardShortcut);
  }, [settings.keyboardShortcut]);

  useEffect(() => {
    ipcRenderer.on('atlasify:reset-app', () => {
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

  const isLoggedIn = useMemo(() => {
    return hasAccounts(auth);
  }, [auth]);

  const loginWithAPIToken = useCallback(
    async ({ username, token }: LoginAPITokenOptions) => {
      // Should check if the token is valid

      const updatedAuth = await addAccount(auth, username, token);

      // TODO - fetch and set user data

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
    [auth, settings],
  );

  const restoreSettings = useCallback(async () => {
    const existing = loadState();

    // Restore settings before accounts to ensure filters are available before fetching notifications
    if (existing.settings) {
      setKeyboardShortcut(existing.settings.keyboardShortcut);
      setAlternateIdleIcon(existing.settings.useAlternateIdleIcon);
      setSettings({ ...defaultSettings, ...existing.settings });
      webFrame.setZoomLevel(
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

  const markNotificationReadWithAccounts = useCallback(
    async (notification: AtlasifyNotification) =>
      await markNotificationRead({ auth, settings }, notification),
    [auth, settings, markNotificationRead],
  );

  const markNotificationUnreadWithAccounts = useCallback(
    async (notification: AtlasifyNotification) =>
      await markNotificationUnread({ auth, settings }, notification),
    [auth, settings, markNotificationUnread],
  );

  const markProductNotificationsReadWithAccounts = useCallback(
    async (notification: AtlasifyNotification) =>
      await markProductNotificationsRead({ auth, settings }, notification),
    [auth, settings, markProductNotificationsRead],
  );

  const markProductNotificationsUnreadWithAccounts = useCallback(
    async (notification: AtlasifyNotification) =>
      await markProductNotificationsUnread({ auth, settings }, notification),
    [auth, settings, markProductNotificationsUnread],
  );

  return (
    <AppContext.Provider
      value={{
        auth,
        isLoggedIn,
        loginWithAPIToken,
        logoutFromAccount,

        status,
        globalError,

        notifications,
        fetchNotifications: fetchNotificationsWithAccounts,

        markNotificationRead: markNotificationReadWithAccounts,
        markNotificationUnread: markNotificationUnreadWithAccounts,

        markProductNotificationsRead: markProductNotificationsReadWithAccounts,
        markProductNotificationsUnread:
          markProductNotificationsUnreadWithAccounts,

        settings,
        clearFilters,
        resetSettings,
        updateSetting,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
