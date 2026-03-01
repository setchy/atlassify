import type { Menubar } from 'menubar';

import { EVENTS, type ITrayColorUpdate } from '../../shared/events';

import { onMainEvent } from '../events';
import { TrayIcons } from '../icons';

/**
 * Determine the correct tray icon path from the current notification state.

 * @param state - The current tray color update state from the renderer.
 * @returns The icon path to display.
 */
export function selectTrayIcon(state: ITrayColorUpdate): string {
  const {
    notificationsCount,
    isOnline,
    useUnreadActiveIcon,
    useAlternateIdleIcon,
  } = state;

  if (!isOnline) {
    return TrayIcons.offline;
  }

  if (notificationsCount < 0) {
    return TrayIcons.error;
  }

  if (notificationsCount > 0 && useUnreadActiveIcon) {
    return TrayIcons.active;
  }

  return useAlternateIdleIcon ? TrayIcons.idleAlternate : TrayIcons.idle;
}

/**
 * Register IPC handlers for tray icon visual state.
 *
 * @param mb - The menubar instance whose tray is controlled.
 */
export function registerTrayHandlers(mb: Menubar): void {
  /**
   * Update the tray icon based on the provided color update data.
   */
  onMainEvent(EVENTS.UPDATE_ICON_COLOR, (_, state: ITrayColorUpdate) => {
    if (!mb.tray.isDestroyed()) {
      mb.tray.setImage(selectTrayIcon(state));
    }
  });

  /**
   * Update the tray icon title based on the provided title string.
   */
  onMainEvent(EVENTS.UPDATE_ICON_TITLE, (_, title: string) => {
    if (!mb.tray.isDestroyed()) {
      mb.tray.setTitle(title);
    }
  });
}
