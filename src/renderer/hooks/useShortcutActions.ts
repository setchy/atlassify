import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useNotificationsStore } from '../stores/notifications';
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

  const { isLoggedIn, settings, updateSetting, auth } = useAppContext();
  const status = useNotificationsStore((state) => state.status);
  const fetchNotifications = useNotificationsStore(
    (state) => state.fetchNotifications,
  );

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
          trackEvent('Action', {
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
          trackEvent('Action', {
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
          trackEvent('Action', {
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

          trackEvent('Action', { name: 'Refresh' });

          navigate('/', { replace: true });
          void fetchNotifications({ auth, settings });
        },
      },
      settings: {
        key: 's',
        isAllowed: isLoggedIn,
        action: () => {
          if (isOnSettingsRoute) {
            navigate('/', { replace: true });
            void fetchNotifications({ auth, settings });
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
          trackEvent('Application', { event: 'Quit' });

          quitApp();
        },
      },
    };
  }, [
    auth,
    fetchNotifications,
    isLoggedIn,
    isLoading,
    isOnFiltersRoute,
    isOnSettingsRoute,
    settings,
    updateSetting,
  ]);

  return { shortcuts };
}
