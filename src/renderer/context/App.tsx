import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Constants } from '../constants';

import { useIntervalTimer } from '../hooks/useIntervalTimer';

import type {
  Account,
  AuthState,
  ConfigSettingsState,
  ConfigSettingsValue,
  FilterSettingsState,
  FilterSettingsValue,
  SettingsState,
  SettingsValue,
  Status,
} from '../types';
import type { LoginOptions } from '../utils/auth/types';

import {
  selectHasMoreAccountNotifications,
  selectHasNotifications,
  selectNotificationCount,
  useNotificationsStore,
} from '../stores/notifications';
import {
  addAccount,
  hasAccounts,
  refreshAccount,
  removeAccount,
} from '../utils/auth/utils';
import {
  setAutoLaunch,
  setKeyboardShortcut,
  setUseAlternateIdleIcon,
  setUseUnreadActiveIcon,
} from '../utils/comms';
import { clearState, loadState, saveState } from '../utils/storage';
import { setTheme } from '../utils/theme';
import { setTrayIconColorAndTitle } from '../utils/tray';
import { zoomLevelToPercentage, zoomPercentageToLevel } from '../utils/zoom';
import { AppContext } from './App.context';
import {
  defaultAuth,
  defaultFilterSettings,
  defaultSettings,
} from './defaults';

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const existingState = loadState();

  const [auth, setAuth] = useState<AuthState>(
    existingState.auth
      ? { ...defaultAuth, ...existingState.auth }
      : defaultAuth,
  );

  const [settings, setSettings] = useState<SettingsState>(
    existingState.settings
      ? { ...defaultSettings, ...existingState.settings }
      : defaultSettings,
  );

  // Get notifications actions and state from Zustand store
  const {
    status,
    globalError,
    fetchNotifications,
    removeAccountNotifications,
    markNotificationsRead,
    markNotificationsUnread,
  } = useNotificationsStore();

  const notifications = useNotificationsStore((state) => state.notifications);
  const notificationCount = useNotificationsStore((state) =>
    selectNotificationCount(state, settings),
  );
  const hasNotifications = useNotificationsStore((state) =>
    selectHasNotifications(state, settings),
  );
  const hasMoreAccountNotifications = useNotificationsStore(
    selectHasMoreAccountNotifications,
  );

  const refreshAllAccounts = useCallback(() => {
    if (!auth.accounts.length) {
      return;
    }

    return Promise.all(auth.accounts.map(refreshAccount));
  }, [auth.accounts]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Fetch new notifications when account count or filters change
  useEffect(() => {
    fetchNotifications({ auth, settings });
  }, [
    auth.accounts.length,
    settings.fetchOnlyUnreadNotifications,
    settings.groupNotificationsByTitle,
    settings.filterEngagementStates,
    settings.filterCategories,
    settings.filterActors,
    settings.filterReadStates,
    settings.filterProducts,
  ]);

  useIntervalTimer(() => {
    fetchNotifications({ auth, settings });
  }, Constants.FETCH_NOTIFICATIONS_INTERVAL_MS);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Refresh account details on startup
  useEffect(() => {
    refreshAllAccounts();
  }, []);

  // Refresh account details on interval
  useIntervalTimer(() => {
    refreshAllAccounts();
  }, Constants.REFRESH_ACCOUNTS_INTERVAL_MS);

  useEffect(() => {
    setTheme(settings.theme);
  }, [settings.theme]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: We want to update the tray on setting or notification changes
  useEffect(() => {
    setUseUnreadActiveIcon(settings.useUnreadActiveIcon);
    setUseAlternateIdleIcon(settings.useAlternateIdleIcon);

    const trayCount = status === 'error' ? -1 : notificationCount;
    setTrayIconColorAndTitle(trayCount, hasMoreAccountNotifications, settings);
  }, [
    settings.showNotificationsCountInTray,
    settings.useUnreadActiveIcon,
    settings.useAlternateIdleIcon,
    notifications,
  ]);

  useEffect(() => {
    setKeyboardShortcut(settings.keyboardShortcutEnabled);
  }, [settings.keyboardShortcutEnabled]);

  useEffect(() => {
    setAutoLaunch(settings.openAtStartup);
  }, [settings.openAtStartup]);

  useEffect(() => {
    window.atlassify.onResetApp(() => {
      clearState();
      setAuth(defaultAuth);
      setSettings(defaultSettings);
    });
  }, []);

  const clearFilters = useCallback(() => {
    setSettings((prevSettings) => {
      const newSettings = { ...prevSettings, ...defaultFilterSettings };
      saveState({ auth, settings: newSettings });
      return newSettings;
    });
  }, [auth]);

  const resetSettings = useCallback(() => {
    setSettings(() => {
      saveState({ auth, settings: defaultSettings });
      return defaultSettings;
    });
  }, [auth]);

  const updateSetting = useCallback(
    (name: keyof SettingsState, value: SettingsValue) => {
      setSettings((prevSettings) => {
        const newSettings = { ...prevSettings, [name]: value };
        saveState({ auth, settings: newSettings });
        return newSettings;
      });
    },
    [auth],
  );

  const updateFilter = useCallback(
    (
      name: keyof FilterSettingsState,
      value: FilterSettingsValue,
      checked: boolean,
    ) => {
      const updatedFilters = checked
        ? [...settings[name], value]
        : settings[name].filter((item) => item !== value);

      updateSetting(name, updatedFilters);
    },
    [updateSetting, settings],
  );

  // Global window zoom handler / listener
  // biome-ignore lint/correctness/useExhaustiveDependencies: We want to update on settings.zoomPercentage changes
  useEffect(() => {
    // Set the zoom level when settings.zoomPercentage changes
    window.atlassify.zoom.setLevel(
      zoomPercentageToLevel(settings.zoomPercentage),
    );

    // Sync zoom percentage in settings when window is resized
    let timeout: NodeJS.Timeout;
    const DELAY = 200;

    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const zoomPercentage = zoomLevelToPercentage(
          window.atlassify.zoom.getLevel(),
        );

        if (zoomPercentage !== settings.zoomPercentage) {
          updateSetting('zoomPercentage', zoomPercentage);
        }
      }, DELAY);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeout);
    };
  }, [settings.zoomPercentage]);

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

      const updatedAuth = removeAccount(auth, account);

      setAuth(updatedAuth);
      saveState({ auth: updatedAuth, settings });
    },
    [auth, settings, removeAccountNotifications],
  );

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
      removeAccountNotifications,

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
