import {
  app,
  globalShortcut,
  ipcMain as ipc,
  nativeTheme,
  safeStorage,
} from 'electron';
import log from 'electron-log';
import { menubar } from 'menubar';

import { APPLICATION } from '../shared/constants';
import { namespacedEvent } from '../shared/events';
import { isMacOS, isWindows } from '../shared/platform';
import { onFirstRunMaybe } from './first-run';
import { TrayIcons } from './icons';
import MenuBuilder from './menu';
import Updater from './updater';

log.initialize();

const browserWindowOpts: Electron.BrowserWindowConstructorOptions = {
  width: 500,
  height: 400,
  minWidth: 500,
  minHeight: 400,
  resizable: false,
  skipTaskbar: true, // Hide the app from the Windows taskbar
  // TODO ideally we would disable this as use a preload script with a context bridge
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
  },
};

const mb = menubar({
  icon: TrayIcons.idle,
  index: `file://${__dirname}/index.html`,
  browserWindow: browserWindowOpts,
  preloadWindow: true,
  showDockIcon: false, // Hide the app from the macOS dock
});

const menuBuilder = new MenuBuilder(mb);
const contextMenu = menuBuilder.buildMenu();

/**
 * Electron Auto Updater only supports macOS and Windows
 * https://github.com/electron/update-electron-app
 */
if (isMacOS() || isWindows()) {
  const updater = new Updater(mb, menuBuilder);
  updater.initialize();
}

let shouldUseAlternateIdleIcon = false;

app.whenReady().then(async () => {
  await onFirstRunMaybe();

  mb.on('ready', () => {
    mb.app.setAppUserModelId(APPLICATION.ID);

    // Tray configuration
    mb.tray.setToolTip(APPLICATION.NAME);
    mb.tray.setIgnoreDoubleClickEvents(true);
    mb.tray.on('right-click', (_event, bounds) => {
      mb.tray.popUpContextMenu(contextMenu, { x: bounds.x, y: bounds.y });
    });

    // Custom key events
    mb.window.webContents.on('before-input-event', (event, input) => {
      if (input.key === 'Escape') {
        mb.window.hide();
        event.preventDefault();
      }
    });

    // DevTools configuration
    mb.window.webContents.on('devtools-opened', () => {
      mb.window.setSize(800, 600);
      mb.window.center();
      mb.window.resizable = true;
      mb.window.setAlwaysOnTop(true);
    });

    mb.window.webContents.on('devtools-closed', () => {
      const trayBounds = mb.tray.getBounds();
      mb.window.setSize(browserWindowOpts.width, browserWindowOpts.height);
      mb.positioner.move('trayCenter', trayBounds);
      mb.window.resizable = false;
    });
  });

  nativeTheme.on('updated', () => {
    if (nativeTheme.shouldUseDarkColors) {
      mb.window.webContents.send(namespacedEvent('update-theme'), 'DARK');
    } else {
      mb.window.webContents.send(namespacedEvent('update-theme'), 'LIGHT');
    }
  });

  /**
   * Atlassify custom IPC events
   */
  ipc.handle(namespacedEvent('version'), () => app.getVersion());

  ipc.on(namespacedEvent('window-show'), () => mb.showWindow());

  ipc.on(namespacedEvent('window-hide'), () => mb.hideWindow());

  ipc.on(namespacedEvent('quit'), () => mb.app.quit());

  ipc.on(
    namespacedEvent('use-alternate-idle-icon'),
    (_, useAlternateIdleIcon) => {
      shouldUseAlternateIdleIcon = useAlternateIdleIcon;
    },
  );

  ipc.on(namespacedEvent('icon-error'), () => {
    if (!mb.tray.isDestroyed()) {
      mb.tray.setImage(TrayIcons.error);
    }
  });

  ipc.on(namespacedEvent('icon-active'), () => {
    if (!mb.tray.isDestroyed()) {
      mb.tray.setImage(TrayIcons.active);
    }
  });

  ipc.on(namespacedEvent('icon-idle'), () => {
    if (!mb.tray.isDestroyed()) {
      if (shouldUseAlternateIdleIcon) {
        mb.tray.setImage(TrayIcons.idleAlternate);
      } else {
        mb.tray.setImage(TrayIcons.idle);
      }
    }
  });

  ipc.on(namespacedEvent('update-title'), (_, title) => {
    if (!mb.tray.isDestroyed()) {
      mb.tray.setTitle(title);
    }
  });

  ipc.on(
    namespacedEvent('update-keyboard-shortcut'),
    (_, { enabled, keyboardShortcut }) => {
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

  ipc.on(namespacedEvent('update-auto-launch'), (_, settings) => {
    app.setLoginItemSettings(settings);
  });

  // Safe Storage
  ipc.handle(namespacedEvent('safe-storage-encrypt'), (_, settings) => {
    return safeStorage.encryptString(settings).toString('base64');
  });

  ipc.handle(namespacedEvent('safe-storage-decrypt'), (_, settings) => {
    return safeStorage.decryptString(Buffer.from(settings, 'base64'));
  });
});
