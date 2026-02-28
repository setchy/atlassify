import type { Menubar } from 'menubar';

import { EVENTS, type ITrayColorUpdate } from '../../shared/events';

import { onMainEvent } from '../events';
import { TrayIcons } from '../icons';

export function registerTrayHandlers(mb: Menubar): void {
  onMainEvent(EVENTS.WINDOW_SHOW, () => mb.showWindow());

  onMainEvent(EVENTS.WINDOW_HIDE, () => mb.hideWindow());

  onMainEvent(EVENTS.QUIT, () => mb.app.quit());

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

  onMainEvent(EVENTS.UPDATE_ICON_TITLE, (_, title: string) => {
    if (!mb.tray.isDestroyed()) {
      mb.tray.setTitle(title);
    }
  });
}
