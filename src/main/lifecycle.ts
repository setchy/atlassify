import { app, nativeTheme } from 'electron';
import type { Menubar } from 'menubar';

import { APPLICATION } from '../shared/constants';
import { EVENTS } from '../shared/events';
import { logWarn } from '../shared/logger';
import { Theme } from '../shared/theme';

import { WindowConfig } from './config';
import { sendRendererEvent } from './events';

export function initializeAppLifecycle(mb: Menubar): void {
  mb.on('ready', () => {
    mb.app.setAppUserModelId(APPLICATION.ID);

    mb.tray.setToolTip(APPLICATION.NAME);
    mb.tray.setIgnoreDoubleClickEvents(true);
  });

  nativeTheme.on('updated', () => {
    if (nativeTheme.shouldUseDarkColors) {
      sendRendererEvent(mb, EVENTS.UPDATE_THEME, Theme.DARK);
    } else {
      sendRendererEvent(mb, EVENTS.UPDATE_THEME, Theme.LIGHT);
    }
  });

  preventSecondInstance(mb);
}

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

export function configureWindowEvents(mb: Menubar): void {
  if (!mb.window) {
    return;
  }

  mb.window.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'Escape') {
      mb.hideWindow();
      event.preventDefault();
    }
  });

  mb.window.webContents.on('devtools-opened', () => {
    mb.window.setSize(800, 600);
    mb.window.center();
    mb.window.resizable = true;
    mb.window.setAlwaysOnTop(true);
  });

  mb.window.webContents.on('devtools-closed', () => {
    const trayBounds = mb.tray.getBounds();
    mb.window.setSize(WindowConfig.width, WindowConfig.height);
    mb.positioner.move('trayCenter', trayBounds);
    mb.window.resizable = false;
  });
}
