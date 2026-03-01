import { app, nativeTheme } from 'electron';
import type { Menubar } from 'menubar';

import { APPLICATION } from '../../shared/constants';
import { EVENTS } from '../../shared/events';
import { logWarn } from '../../shared/logger';
import { Theme } from '../../shared/theme';

import { sendRendererEvent } from '../events';

/**
 * Set up core application lifecycle events.
 *
 * @param mb - The menubar instance to attach lifecycle events to.
 */
export function initializeAppLifecycle(mb: Menubar): void {
  mb.on('ready', () => {
    mb.app.setAppUserModelId(APPLICATION.ID);

    mb.tray.setToolTip(APPLICATION.NAME);
    mb.tray.setIgnoreDoubleClickEvents(true);
  });

  /**
   * Listen for changes in the OS color scheme and forward theme updates to the renderer process.
   */
  nativeTheme.on('updated', () => {
    if (nativeTheme.shouldUseDarkColors) {
      sendRendererEvent(mb, EVENTS.UPDATE_THEME, Theme.DARK);
    } else {
      sendRendererEvent(mb, EVENTS.UPDATE_THEME, Theme.LIGHT);
    }
  });

  preventSecondInstance(mb);
}

/**
 * Enforce a single application instance. If a second instance is launched,
 * the existing window is shown and the new process quits immediately.
 *
 * @param mb - The menubar instance to show when a second instance is detected.
 */
function preventSecondInstance(mb: Menubar): void {
  const gotTheLock = app.requestSingleInstanceLock();

  if (!gotTheLock) {
    logWarn('main:gotTheLock', 'Second instance detected, quitting');
    app.quit();
    return;
  }

  app.on('second-instance', () => {
    mb.showWindow();
  });
}
