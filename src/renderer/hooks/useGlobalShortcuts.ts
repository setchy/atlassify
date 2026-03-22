import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { keybindings } from '../constants/keybindings';

import { useAccountsStore, useSettingsStore } from '../stores';

import { quitApp, trackEvent } from '../utils/system/comms';
import { openMyNotifications } from '../utils/system/links';

type ShortcutName =
  | 'home'
  | 'myNotifications'
  | 'toggleReadUnread'
  | 'groupNotifications'
  | 'groupByTitle'
  | 'filters'
  | 'refresh'
  | 'settings'
  | 'quit'
  | 'accounts';

type ShortcutConfig = {
  /** Shortcut key */
  key: string;
  /** If the shortcut key is enabled */
  isAllowed: boolean;
  /** Action the shortcut key should take */
  action: () => void;
};

type ShortcutConfigs = Record<ShortcutName, ShortcutConfig>;

interface UseGlobalShortcutsOptions {
  /** Triggers a notifications refresh. */
  fetchNotifications: () => Promise<void>;
  /** Whether a notifications fetch is currently in-flight. */
  isLoading: boolean;
}

interface UseGlobalShortcutsResult {
  /** All shortcut configs, actions, and enabled state. */
  shortcuts: ShortcutConfigs;
}

/**
 * Centralized shortcut actions, enabled state, and hotkeys.
 * Used by both the global keyboard listener and UI shortcut hint buttons.
 */
export function useGlobalShortcuts({
  fetchNotifications,
  isLoading,
}: UseGlobalShortcutsOptions): UseGlobalShortcutsResult {
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = useAccountsStore((s) => s.isLoggedIn());

  const isOnNotificationsRoute = location.pathname === '/';
  const isOnFiltersRoute = location.pathname.startsWith('/filters');
  const isOnSettingsRoute = location.pathname.startsWith('/settings');

  /**
   * All shortcut configs and actions.
   */
  const shortcuts: ShortcutConfigs = useMemo(() => {
    return {
      home: {
        key: keybindings.shortcuts.home.eventKey,
        isAllowed: true,
        action: () => navigate('/', { replace: true }),
      },
      myNotifications: {
        key: keybindings.shortcuts.myNotifications.eventKey,
        isAllowed: isLoggedIn,
        action: () => openMyNotifications(),
      },
      toggleReadUnread: {
        key: keybindings.shortcuts.toggleReadUnread.eventKey,
        isAllowed: isLoggedIn && !isLoading,
        action: () => {
          trackEvent('Action', {
            name: 'Toggle Read/Unread',
          });

          useSettingsStore
            .getState()
            .toggleSetting('fetchOnlyUnreadNotifications');
        },
      },
      groupNotifications: {
        key: keybindings.shortcuts.groupNotifications.eventKey,
        isAllowed: isLoggedIn,
        action: () => {
          trackEvent('Action', {
            name: 'Group By Product',
          });

          useSettingsStore
            .getState()
            .toggleSetting('groupNotificationsByProduct');
        },
      },
      groupByTitle: {
        key: keybindings.shortcuts.groupByTitle.eventKey,
        isAllowed: isLoggedIn,
        action: () => {
          trackEvent('Action', {
            name: 'Group By Title',
          });

          useSettingsStore
            .getState()
            .toggleSetting('groupNotificationsByTitle');
        },
      },
      filters: {
        key: keybindings.shortcuts.filters.eventKey,
        isAllowed: isLoggedIn,
        action: () => {
          if (isOnFiltersRoute) {
            navigate('/', { replace: true });
          } else {
            navigate('/filters');
          }
        },
      },
      refresh: {
        key: keybindings.shortcuts.refresh.eventKey,
        isAllowed: !isLoading,
        action: () => {
          if (isLoading) {
            return;
          }

          trackEvent('Action', { name: 'Refresh' });

          if (!isOnNotificationsRoute) {
            navigate('/', { replace: true });
          }

          fetchNotifications();
        },
      },
      settings: {
        key: keybindings.shortcuts.settings.eventKey,
        isAllowed: isLoggedIn,
        action: () => {
          if (isOnSettingsRoute) {
            navigate('/', { replace: true });
          } else {
            navigate('/settings');
          }
        },
      },
      accounts: {
        key: keybindings.shortcuts.accounts.eventKey,
        isAllowed: isLoggedIn && isOnSettingsRoute,
        action: () => navigate('/accounts'),
      },
      quit: {
        key: keybindings.shortcuts.quit.eventKey,
        isAllowed: !isLoggedIn || isOnSettingsRoute,
        action: () => {
          trackEvent('Application', { event: 'Quit' });

          quitApp();
        },
      },
    };
  }, [
    isLoggedIn,
    isLoading,
    isOnFiltersRoute,
    isOnSettingsRoute,
    isOnNotificationsRoute,
    fetchNotifications,
  ]);

  return { shortcuts };
}
