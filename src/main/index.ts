import { config } from 'dotenv';

config();

import { app } from 'electron';
import log from 'electron-log';
import { menubar } from 'menubar';

import { Paths, WindowConfig } from './config';
import {
  initializeAnalytics,
  registerAnalyticsHandlers,
  registerAppHandlers,
  registerStorageHandlers,
  registerSystemHandlers,
  registerTrayHandlers,
  trackEvent,
} from './handlers';
import { TrayIcons } from './icons';
import {
  configureWindowEvents,
  initializeAppLifecycle,
  onFirstRunMaybe,
} from './lifecycle';
import MenuBuilder from './menu';
import AppUpdater from './updater';

log.initialize();

initializeAnalytics();

const mb = menubar({
  icon: TrayIcons.idle,
  index: Paths.indexHtml,
  browserWindow: WindowConfig,
  preloadWindow: true,
  showDockIcon: false, // Hide the app from the macOS dock
});

const menuBuilder = new MenuBuilder(mb);
const contextMenu = menuBuilder.buildMenu();

const appUpdater = new AppUpdater(mb, menuBuilder);

app.whenReady().then(async () => {
  trackEvent('Application', { event: 'Launched' });

  await onFirstRunMaybe();

  appUpdater.start();

  initializeAppLifecycle(mb, contextMenu);

  // Configure window event handlers
  configureWindowEvents(mb);

  // Register IPC handlers for various channels
  registerTrayHandlers(mb);
  registerSystemHandlers(mb);
  registerStorageHandlers();
  registerAppHandlers(mb);
  registerAnalyticsHandlers();
});
