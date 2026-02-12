import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import useAccountsStore from '../stores/useAccountsStore';
import useSettingsStore from '../stores/useSettingsStore';

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
export function useShortcutActions(): { shortcuts: ShortcutConfigs } {
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
        key: 'h',
        isAllowed: true,
        action: () => navigate('/', { replace: true }),
      },
      myNotifications: {
        key: 'n',
        isAllowed: isLoggedIn,
        action: () => openMyNotifications(),
      },
      toggleReadUnread: {
        key: 'u',
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
        key: 'p',
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
        key: 't',
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
        key: 'f',
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
        key: 'r',
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
        key: 's',
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
        key: 'c',
        isAllowed: isLoggedIn && isOnSettingsRoute,
        action: () => navigate('/accounts'),
      },
      quit: {
        key: 'q',
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
