import { config } from 'dotenv';

config();

import { app } from 'electron';
import log from 'electron-log';
import { menubar } from 'menubar';

import { Paths, WindowConfig } from './config';
import {
  initializeAnalytics,
  registerAnalyticsHandlers,
  trackEvent,
} from './handlers/analytics';
import { registerAppHandlers } from './handlers/app';
import { registerStorageHandlers } from './handlers/storage';
import { registerSystemHandlers } from './handlers/system';
import { registerTrayHandlers } from './handlers/tray';
import { TrayIcons } from './icons';
import { onFirstRunMaybe } from './lifecycle/first-run';
import { initializeAppLifecycle } from './lifecycle/startup';
import { configureWindowEvents } from './lifecycle/window';
import MenuBuilder from './menu';
import AppUpdater from './updater';

log.initialize();

initializeAnalytics();

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

  // Configure window event handlers
  configureWindowEvents(mb);

  // Register IPC handlers for various channels
  registerTrayHandlers(mb);
  registerSystemHandlers(mb);
  registerStorageHandlers();
  registerAppHandlers(mb);
  registerAnalyticsHandlers();
});
