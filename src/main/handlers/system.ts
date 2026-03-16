import { app, globalShortcut, powerMonitor, shell } from 'electron';
import type { Menubar } from 'menubar';

import {
  EVENTS,
  type IAutoLaunch,
  type IKeyboardShortcut,
  type IOpenExternal,
} from '../../shared/events';
import { logInfo } from '../../shared/logger';

import { onMainEvent, sendRendererEvent } from '../events';

/**
 * Register IPC handlers for OS-level system operations.
 *
 * @param mb - The menubar instance used for show/hide on keyboard shortcut activation.
 */
export function registerSystemHandlers(mb: Menubar): void {
  /**
   * Send resume event on resume
   */
  powerMonitor.on('resume', () => {
    sendRendererEvent(mb, EVENTS.SYSTEM_RESUME);
    logInfo(
      'power monitor',
      'resume event triggered. will refetch notifications',
    );
  });

  /**
   * Send resume event on screen unlock
   */
  powerMonitor.on('unlock-screen', () => {
    sendRendererEvent(mb, EVENTS.SYSTEM_RESUME);
    logInfo(
      'power monitor',
      'unlock-screen event triggered.  will refetch notifications',
    );
  });

  /**
   * Open the given URL in the user's default browser, with an option to activate the app.
   */
  onMainEvent(EVENTS.OPEN_EXTERNAL, (_, { url, activate }: IOpenExternal) =>
    shell.openExternal(url, { activate }),
  );

  /**
   * Register or unregister a global keyboard shortcut that toggles the menubar window visibility.
   */
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

  /**
   * Update the application's auto-launch setting based on the provided configuration.
   */
  onMainEvent(EVENTS.UPDATE_AUTO_LAUNCH, (_, settings: IAutoLaunch) => {
    app.setLoginItemSettings(settings);
  });
}
