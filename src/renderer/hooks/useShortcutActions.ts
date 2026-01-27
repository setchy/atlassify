import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { quitApp, trackEvent } from '../utils/comms';
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

  const { fetchNotifications, isLoggedIn, status, settings, updateSetting } =
    useAppContext();

  const isOnFiltersRoute = location.pathname.startsWith('/filters');
  const isOnSettingsRoute = location.pathname.startsWith('/settings');
  const isLoading = status === 'loading';

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
          trackEvent('action', {
            name: 'Toggle Read/Unread',
          });

          updateSetting(
            'fetchOnlyUnreadNotifications',
            !settings.fetchOnlyUnreadNotifications,
          );
        },
      },
      groupByProduct: {
        key: 'p',
        isAllowed: isLoggedIn,
        action: () => {
          trackEvent('action', {
            name: 'Group By Product',
          });

          updateSetting(
            'groupNotificationsByProduct',
            !settings.groupNotificationsByProduct,
          );
        },
      },
      groupByTitle: {
        key: 't',
        isAllowed: isLoggedIn,
        action: () => {
          trackEvent('action', {
            name: 'Group By Title',
          });

          updateSetting(
            'groupNotificationsByTitle',
            !settings.groupNotificationsByTitle,
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

          trackEvent('action', { name: 'Refresh' });

          navigate('/', { replace: true });
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
        key: 'a',
        isAllowed: isLoggedIn && isOnSettingsRoute,
        action: () => navigate('/accounts'),
      },
      quit: {
        key: 'q',
        isAllowed: !isLoggedIn || isOnSettingsRoute,
        action: () => {
          trackEvent('app', { event: 'Quit' });

          quitApp();
        },
      },
    };
  }, [
    isLoggedIn,
    isLoading,
    isOnFiltersRoute,
    isOnSettingsRoute,
    fetchNotifications,
    settings.fetchOnlyUnreadNotifications,
    settings.groupNotificationsByProduct,
    settings.groupNotificationsByTitle,
    updateSetting,
  ]);

  return { shortcuts };
}
