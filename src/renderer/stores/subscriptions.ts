/**
 * Store subscriptions that watch for state changes and trigger corresponding side effects.
 *
 * Should be initialized once during app startup within a React useEffect hook
 * to ensure proper lifecycle management and cleanup on unmount.
 */

import { shallow } from 'zustand/shallow';

import { queryClient } from '../utils/api/client';
import { notificationsKeys } from '../utils/api/queryKeys';
import { setAutoLaunch, setKeyboardShortcut } from '../utils/comms';
import { setTheme } from '../utils/theme';
import { setTrayIconColorAndTitle } from '../utils/tray';
import { zoomLevelToPercentage, zoomPercentageToLevel } from '../utils/zoom';
import {
  useAccountsStore,
  useFiltersStore,
  useRuntimeStore,
  useSettingsStore,
} from './';

/**
 * Initialize all store side-effect subscriptions and startup values for main.
 * Should be called once on app initialization within a React useEffect hook.
 *
 * @returns Cleanup function to unsubscribe all listeners
 */
export function initializeStoreSubscriptions(): () => void {
  const unsubscribers: Array<() => void> = [];

  // ========================================================================
  // Startup Initialization
  // ========================================================================
  setTheme(useSettingsStore.getState().theme);
  setAutoLaunch(useSettingsStore.getState().openAtStartup);
  setKeyboardShortcut(useSettingsStore.getState().keyboardShortcutEnabled);
  setTrayIconColorAndTitle();

  // ========================================================================
  // Settings Store Side Effects
  // ========================================================================

  // Theme changes
  const unsubTheme = useSettingsStore.subscribe(
    (state) => state.theme,
    (theme) => {
      setTheme(theme);
    },
  );
  unsubscribers.push(unsubTheme);

  // Auto launch on startup
  const unsubAutoLaunch = useSettingsStore.subscribe(
    (state) => state.openAtStartup,
    (openAtStartup) => {
      setAutoLaunch(openAtStartup);
    },
  );
  unsubscribers.push(unsubAutoLaunch);

  // Keyboard shortcut
  const unsubKeyboard = useSettingsStore.subscribe(
    (state) => state.keyboardShortcutEnabled,
    (keyboardShortcutEnabled) => {
      setKeyboardShortcut(keyboardShortcutEnabled);
    },
  );
  unsubscribers.push(unsubKeyboard);

  // Tray updates for settings changes that affect tray appearance
  const unsubTrayAppearance = useSettingsStore.subscribe(
    (state) => ({
      useUnreadActiveIcon: state.useUnreadActiveIcon,
      useAlternateIdleIcon: state.useAlternateIdleIcon,
      showNotificationsCountInTray: state.showNotificationsCountInTray,
    }),
    setTrayIconColorAndTitle,
    { equalityFn: shallow },
  );
  unsubscribers.push(unsubTrayAppearance);

  // Initialize zoom level from saved settings on startup
  const initialZoomPercentage = useSettingsStore.getState().zoomPercentage;
  window.atlassify.zoom.setLevel(zoomPercentageToLevel(initialZoomPercentage));

  // Zoom percentage changes
  const unsubZoom = useSettingsStore.subscribe(
    (state) => state.zoomPercentage,
    (zoomPercentage) => {
      window.atlassify.zoom.setLevel(zoomPercentageToLevel(zoomPercentage));
    },
  );
  unsubscribers.push(unsubZoom);

  // Set up zoom level sync from window resize
  let timeout: NodeJS.Timeout;
  const DELAY = 200;

  const handleResize = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      const zoomPercentage = zoomLevelToPercentage(
        window.atlassify.zoom.getLevel(),
      );
      const currentZoomPercentage = useSettingsStore.getState().zoomPercentage;

      if (zoomPercentage !== currentZoomPercentage) {
        useSettingsStore
          .getState()
          .updateSetting('zoomPercentage', zoomPercentage);
      }
    }, DELAY);
  };

  window.addEventListener('resize', handleResize);
  unsubscribers.push(() => {
    window.removeEventListener('resize', handleResize);
    clearTimeout(timeout);
  });

  // ========================================================================
  // Filters Store Side Effects
  // ========================================================================

  // Subscribe to filters store changes
  const unsubFilters = useFiltersStore.subscribe(() => {
    // Build the query key to match useNotifications
    const accounts = useAccountsStore.getState().accounts;
    const fetchOnlyUnreadNotifications =
      useSettingsStore.getState().fetchOnlyUnreadNotifications;
    const groupNotificationsByTitle =
      useSettingsStore.getState().groupNotificationsByTitle;

    const queryKey = notificationsKeys.list(
      accounts.length,
      fetchOnlyUnreadNotifications,
      groupNotificationsByTitle,
    );

    // When filters change, invalidate queries to trigger select re-execution
    // The select function in useQuery will reapply filters to cached unfiltered data
    // This happens instantly without API calls
    queryClient.invalidateQueries({ queryKey, refetchType: 'none' });
  });
  unsubscribers.push(unsubFilters);

  // ========================================================================
  // Runtime Store Side Effects
  // ========================================================================

  // Tray updates when notification status changes
  const unsubRuntime = useRuntimeStore.subscribe(
    (state) => ({
      notificationCount: state.notificationCount,
      hasMoreAccountNotifications: state.hasMoreAccountNotifications,
      isError: state.isError,
      isOnline: state.isOnline,
    }),
    setTrayIconColorAndTitle,
    { equalityFn: shallow },
  );
  unsubscribers.push(unsubRuntime);

  // ========================================================================
  // Additional store subscriptions can be added here following the same pattern
  // ========================================================================

  // Return cleanup function that unsubscribes all listeners
  return () => {
    for (const unsubscribe of unsubscribers) {
      unsubscribe();
    }
  };
}
