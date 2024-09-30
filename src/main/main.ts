import {
  app,
  globalShortcut,
  ipcMain as ipc,
  nativeTheme,
  safeStorage,
} from 'electron';
import log from 'electron-log';
import { menubar } from 'menubar';
import { onFirstRunMaybe } from './first-run';
import { activeIcon, idleAlternateIcon, idleIcon } from './icons';
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
  icon: idleIcon,
  index: `file://${__dirname}/index.html`,
  browserWindow: browserWindowOpts,
  preloadWindow: true,
  showDockIcon: false, // Hide the app from the macOS dock
});

const menuBuilder = new MenuBuilder(mb);
const contextMenu = menuBuilder.buildMenu();

new Updater(mb, menuBuilder);

let shouldUseAlternateIdleIcon = false;

app.whenReady().then(async () => {
  await onFirstRunMaybe();

  mb.on('ready', () => {
    mb.app.setAppUserModelId('com.electron.atlassify');

    // Tray configuration
    mb.tray.setToolTip('Atlassify');
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
      mb.window.webContents.send('atlassify:update-theme', 'DARK');
    } else {
      mb.window.webContents.send('atlassify:update-theme', 'LIGHT');
    }
  });

  /**
   * Atlassify custom IPC events
   */
  ipc.handle('atlassify:version', () => app.getVersion());

  ipc.on('atlassify:window-show', () => mb.showWindow());

  ipc.on('atlassify:window-hide', () => mb.hideWindow());

  ipc.on('atlassify:quit', () => mb.app.quit());

  ipc.on('atlassify:use-alternate-idle-icon', (_, useAlternateIdleIcon) => {
    shouldUseAlternateIdleIcon = useAlternateIdleIcon;
  });

  ipc.on('atlassify:icon-active', () => {
    if (!mb.tray.isDestroyed()) {
      mb.tray.setImage(activeIcon);
    }
  });

  ipc.on('atlassify:icon-idle', () => {
    if (!mb.tray.isDestroyed()) {
      if (shouldUseAlternateIdleIcon) {
        mb.tray.setImage(idleAlternateIcon);
      } else {
        mb.tray.setImage(idleIcon);
      }
    }
  });

  ipc.on('atlassify:update-title', (_, title) => {
    if (!mb.tray.isDestroyed()) {
      mb.tray.setTitle(title);
    }
  });

  ipc.on(
    'atlassify:update-keyboard-shortcut',
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

  ipc.on('atlassify:update-auto-launch', (_, settings) => {
    app.setLoginItemSettings(settings);
  });

  // Safe Storage
  ipc.handle('atlassify:safe-storage-encrypt', (_, settings) => {
    return safeStorage.encryptString(settings).toString('base64');
  });

  ipc.handle('atlassify:safe-storage-decrypt', (_, settings) => {
    return safeStorage.decryptString(Buffer.from(settings, 'base64'));
  });
});
