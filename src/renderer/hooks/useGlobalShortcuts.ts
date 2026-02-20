import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { keybindings } from '../constants/keybindings';

import { useAccountsStore, useSettingsStore } from '../stores';

import { quitApp, setKeyboardShortcut, trackEvent } from '../utils/comms';
import { openMyNotifications } from '../utils/links';
import { useAppContext } from './useAppContext';

type ShortcutName =
  | 'home'
  | 'myNotifications'
  | 'toggleReadUnread'
  | 'groupByProduct'
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

/**
 * Centralized shortcut actions + enabled state + hotkeys.
 * Used by both the global shortcuts component and UI buttons to avoid duplication.
 */
export function useGlobalShortcuts(): { shortcuts: ShortcutConfigs } {
  const navigate = useNavigate();
  const location = useLocation();

  const { fetchNotifications, status } = useAppContext();
  const isLoggedIn = useAccountsStore((s) => s.isLoggedIn());

  const isOnNotificationsRoute = location.pathname === '/';
  const isOnFiltersRoute = location.pathname.startsWith('/filters');
  const isOnSettingsRoute = location.pathname.startsWith('/settings');
  const isLoading = status === 'loading';

  const keyboardShortcutEnabled = useSettingsStore(
    (s) => s.keyboardShortcutEnabled,
  );

  useEffect(() => {
    setKeyboardShortcut(keyboardShortcutEnabled);
  }, [keyboardShortcutEnabled]);

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
            .updateSetting(
              'fetchOnlyUnreadNotifications',
              !useSettingsStore.getState().fetchOnlyUnreadNotifications,
            );
        },
      },
      groupByProduct: {
        key: keybindings.shortcuts.groupByProduct.eventKey,
        isAllowed: isLoggedIn,
        action: () => {
          trackEvent('Action', {
            name: 'Group By Product',
          });

          useSettingsStore
            .getState()
            .updateSetting(
              'groupNotificationsByProduct',
              !useSettingsStore.getState().groupNotificationsByProduct,
            );
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
            .updateSetting(
              'groupNotificationsByTitle',
              !useSettingsStore.getState().groupNotificationsByTitle,
            );
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

          void fetchNotifications();
        },
      },
      settings: {
        key: keybindings.shortcuts.settings.eventKey,
        isAllowed: isLoggedIn,
        action: () => {
          if (isOnSettingsRoute) {
            navigate('/', { replace: true });
            void fetchNotifications();
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
