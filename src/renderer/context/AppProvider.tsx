import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useAccounts } from '../hooks/useAccounts';
import { useNotifications } from '../hooks/useNotifications';

import type {
  Account,
  AtlassifyNotification,
  AuthState,
  SettingsState,
  SettingsValue,
} from '../types';
import type { LoginOptions } from '../utils/auth/types';

import useFiltersStore from '../stores/useFiltersStore';
import { addAccount, hasAccounts, removeAccount } from '../utils/auth/utils';
import {
  setAutoLaunch,
  setUseAlternateIdleIcon,
  setUseUnreadActiveIcon,
} from '../utils/comms';
import { clearState, loadState, saveState } from '../utils/storage';
import { setTheme } from '../utils/theme';
import { setTrayIconColorAndTitle } from '../utils/tray';
import { zoomLevelToPercentage, zoomPercentageToLevel } from '../utils/zoom';
import { AppContext, type AppContextState } from './AppContext';
import { defaultAuth, defaultSettings } from './defaults';

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const existingState = loadState();

  const resetFilters = useFiltersStore((s) => s.reset);

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
    setAutoLaunch(settings.openAtStartup);
  }, [settings.openAtStartup]);

  useEffect(() => {
    window.atlassify.onResetApp(() => {
      clearState();
      setAuth(defaultAuth);
      setSettings(defaultSettings);
      resetFilters();
    });
  }, []);

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
      const updatedAuth = removeAccount(auth, account);

      setAuth(updatedAuth);
      saveState({ auth: updatedAuth, settings });
    },
    [auth, settings],
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
      resetSettings,
      updateSetting,
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
      resetSettings,
      updateSetting,
    ],
  );

  return (
    <AppContext.Provider value={contextValues}>{children}</AppContext.Provider>
  );
};
