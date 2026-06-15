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

if (!app.isPackaged) {
  log.transports.file.fileName = 'main.dev.log';
}

initializeAnalytics();

const mb = menubar({
  icon: TrayIcons.idle,
  index: Paths.indexHtml,
  browserWindow: WindowConfig,
  preloadWindow: true,
  showDockIcon: false, // Hide the app from the macOS dock
  // hideOnClose: true, // TODO - reenable once moving to electron-menubar. Keep renderer state across WM close; Wayland-safe.
  // escapeToHide: true, // TODO - reenable once moving to electron-menubar. Hide the window when Escape is pressed.
});

const menuBuilder = new MenuBuilder(mb);
const contextMenu = menuBuilder.buildMenu();

const appUpdater = new AppUpdater(mb, menuBuilder);

app.whenReady().then(async () => {
  await onFirstRunMaybe();

  appUpdater.start();

  initializeAppLifecycle(mb, contextMenu);

  // Configure window event handlers (Escape key, DevTools resize)
  configureWindowEvents(mb, menuBuilder);

  // Register IPC handlers for various channels
  registerTrayHandlers(mb);
  registerSystemHandlers(mb);
  registerStorageHandlers();
  registerAppHandlers(mb);
  registerAnalyticsHandlers();
});
