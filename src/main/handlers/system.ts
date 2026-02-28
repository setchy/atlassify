import { app, globalShortcut, shell } from 'electron';
import type { Menubar } from 'menubar';

import {
  EVENTS,
  type IAutoLaunch,
  type IKeyboardShortcut,
  type IOpenExternal,
} from '../../shared/events';

import { onMainEvent } from '../events';

export function registerSystemHandlers(mb: Menubar): void {
  onMainEvent(EVENTS.OPEN_EXTERNAL, (_, { url, activate }: IOpenExternal) =>
    shell.openExternal(url, { activate }),
  );

  onMainEvent(
    EVENTS.UPDATE_KEYBOARD_SHORTCUT,
    (_, { enabled, keyboardShortcut }: IKeyboardShortcut) => {
      if (!enabled) {
        globalShortcut.unregister(keyboardShortcut);
        return;
      }

      globalShortcut.register(keyboardShortcut, () => {
        if (mb.window.isVisible()) {
          mb.hideWindow();
        } else {
          mb.showWindow();
        }
      });
    },
  );

  onMainEvent(EVENTS.UPDATE_AUTO_LAUNCH, (_, settings: IAutoLaunch) => {
    app.setLoginItemSettings(settings);
  });
}
