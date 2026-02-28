import { config } from 'dotenv';

config();

import { app } from 'electron';
import log from 'electron-log';
import { menubar } from 'menubar';

import { initializeAptabase, trackEvent } from './aptabase';
import { Paths, WindowConfig } from './config';
import { onFirstRunMaybe } from './first-run';
import { registerAppHandlers } from './handlers/app';
import { registerStorageHandlers } from './handlers/storage';
import { registerSystemHandlers } from './handlers/system';
import { registerTrayHandlers } from './handlers/tray';
import { TrayIcons } from './icons';
import { configureWindowEvents, initializeAppLifecycle } from './lifecycle';
import MenuBuilder from './menu';
import AppUpdater from './updater';

log.initialize();

initializeAptabase();

const mb = menubar({
  icon: TrayIcons.idle,
  index: Paths.indexHtml,
  browserWindow: WindowConfig,
  preloadWindow: true,
  showDockIcon: false,
});

const menuBuilder = new MenuBuilder(mb);
const contextMenu = menuBuilder.buildMenu();

const appUpdater = new AppUpdater(mb, menuBuilder);

app.whenReady().then(async () => {
  trackEvent('Application', { event: 'Launched' });

  await onFirstRunMaybe();

  appUpdater.start();

  initializeAppLifecycle(mb);

  mb.on('ready', () => {
    mb.tray.setIgnoreDoubleClickEvents(true);
    mb.tray.on('right-click', (_event, bounds) => {
      mb.tray.popUpContextMenu(contextMenu, { x: bounds.x, y: bounds.y });
    });
  });

  configureWindowEvents(mb);

  registerTrayHandlers(mb);
  registerSystemHandlers(mb);
  registerStorageHandlers();
  registerAppHandlers();
});
