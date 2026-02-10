/**
 * Side effects subscribers for Zustand stores.
 * These subscribers watch for store changes and trigger corresponding side effects.
 */

import {
  setAutoLaunch,
  setKeyboardShortcut,
  setUseAlternateIdleIcon,
  setUseUnreadActiveIcon,
} from '../utils/comms';
import { setTheme } from '../utils/theme';
import { zoomLevelToPercentage, zoomPercentageToLevel } from '../utils/zoom';
import { useSettingsStore } from './useSettingsStore';

/**
 * Set up all side-effect subscribers for settings changes.
 * Should be called once on app initialization.
 *
 * @returns Cleanup function to unsubscribe all listeners
 */
export function setupSettingsSideEffects(): () => void {
  const unsubscribers: Array<() => void> = [];

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

  // Tray icon settings (unread active icon)
  const unsubUnreadActive = useSettingsStore.subscribe(
    (state) => state.useUnreadActiveIcon,
    (useUnreadActiveIcon) => {
      setUseUnreadActiveIcon(useUnreadActiveIcon);
    },
  );
  unsubscribers.push(unsubUnreadActive);

  // Tray icon settings (alternate idle icon)
  const unsubAlternateIdle = useSettingsStore.subscribe(
    (state) => state.useAlternateIdleIcon,
    (useAlternateIdleIcon) => {
      setUseAlternateIdleIcon(useAlternateIdleIcon);
    },
  );
  unsubscribers.push(unsubAlternateIdle);

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

  // Return cleanup function that unsubscribes all listeners
  return () => {
    for (const unsubscribe of unsubscribers) {
      unsubscribe();
    }
  };
}
