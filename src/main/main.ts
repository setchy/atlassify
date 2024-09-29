import {
  Menu,
  MenuItem,
  app,
  globalShortcut,
  ipcMain as ipc,
  nativeTheme,
  safeStorage,
} from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import { menubar } from 'menubar';
import { updateElectronApp } from 'update-electron-app';
import { onFirstRunMaybe } from './first-run';
import { getIconPath, resetApp, takeScreenshot } from './utils';

log.initialize();

// Tray Icons
const idleIcon = getIconPath('tray-idleTemplate.png');
const idleAlternateIcon = getIconPath('tray-idle-white.png');
const activeIcon = getIconPath('tray-active.png');

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

const checkForUpdatesMenuItem = new MenuItem({
  label: 'Check for updates',
  enabled: true,
  click: () => {
    autoUpdater.checkForUpdatesAndNotify();
  },
});

const updateAvailableMenuItem = new MenuItem({
  label: 'An update is available',
  enabled: false,
  visible: false,
});

const updateReadyForInstallMenuItem = new MenuItem({
  label: 'Restart to update',
  visible: false,
  click: () => {
    autoUpdater.quitAndInstall();
  },
});

const contextMenu = Menu.buildFromTemplate([
  checkForUpdatesMenuItem,
  updateAvailableMenuItem,
  updateReadyForInstallMenuItem,
  { type: 'separator' },
  {
    label: 'Developer',
    submenu: [
      {
        role: 'reload',
        accelerator: 'CommandOrControl+R',
      },
      {
        role: 'toggleDevTools',
        accelerator:
          process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Ctrl+Shift+I',
      },
      {
        label: 'Take Screenshot',
        accelerator: 'CommandOrControl+S',
        click: () => takeScreenshot(mb),
      },
      {
        label: 'Reset App',
        click: () => {
          resetApp(mb);
        },
      },
    ],
  },
  { type: 'separator' },
  {
    label: 'Quit Atlassify',
    accelerator: 'CommandOrControl+Q',
    click: () => {
      mb.app.quit();
    },
  },
]);

const mb = menubar({
  icon: idleIcon,
  index: `file://${__dirname}/index.html`,
  browserWindow: browserWindowOpts,
  preloadWindow: true,
  showDockIcon: false, // Hide the app from the macOS dock
});

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

  // Auto Updater
  updateElectronApp({
    updateInterval: '24 hours',
    logger: log,
  });

  autoUpdater.on('checking-for-update', () => {
    log.info('Auto Updater: Checking for update');
    checkForUpdatesMenuItem.enabled = false;
  });

  autoUpdater.on('error', (error) => {
    log.error('Auto Updater: error checking for update', error);
    checkForUpdatesMenuItem.enabled = true;
  });

  autoUpdater.on('update-available', () => {
    log.info('Auto Updater: New update available');
    updateAvailableMenuItem.visible = true;
    mb.tray.setToolTip('Atlassify\nA new update is available');
  });

  autoUpdater.on('update-downloaded', () => {
    log.info('Auto Updater: Update downloaded');
    updateReadyForInstallMenuItem.visible = true;
    mb.tray.setToolTip('Atlassify\nA new update is ready to install');
  });

  autoUpdater.on('update-not-available', () => {
    log.info('Auto Updater: update not available');
    checkForUpdatesMenuItem.enabled = true;
  });
});
