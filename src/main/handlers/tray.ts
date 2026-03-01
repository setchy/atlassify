import type { Menubar } from 'menubar';

import { EVENTS, type ITrayColorUpdate } from '../../shared/events';

import { onMainEvent } from '../events';
import { TrayIcons } from '../icons';

/**
 * Register IPC handlers for tray icon visual state.
 *
 * @param mb - The menubar instance whose tray is controlled.
 */
export function registerTrayHandlers(mb: Menubar): void {
  /**
   * Update the tray icon based on the provided color update data.
   */
  onMainEvent(
    EVENTS.UPDATE_ICON_COLOR,
    (
      _,
      {
        notificationsCount,
        isOnline,
        useUnreadActiveIcon,
        useAlternateIdleIcon,
      }: ITrayColorUpdate,
    ) => {
      if (!mb.tray.isDestroyed()) {
        if (!isOnline) {
          mb.tray.setImage(TrayIcons.offline);
          return;
        }

        if (notificationsCount < 0) {
          mb.tray.setImage(TrayIcons.error);
          return;
        }

        if (notificationsCount > 0) {
          if (useUnreadActiveIcon) {
            mb.tray.setImage(TrayIcons.active);
          } else {
            mb.tray.setImage(
              useAlternateIdleIcon ? TrayIcons.idleAlternate : TrayIcons.idle,
            );
          }
          return;
        }

        mb.tray.setImage(
          useAlternateIdleIcon ? TrayIcons.idleAlternate : TrayIcons.idle,
        );
      }
    },
  );

  /**
   * Update the tray icon title based on the provided title string.
   */
  onMainEvent(EVENTS.UPDATE_ICON_TITLE, (_, title: string) => {
    if (!mb.tray.isDestroyed()) {
      mb.tray.setTitle(title);
    }
  });
}
