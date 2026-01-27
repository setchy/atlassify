import path from 'node:path';

import {
  app,
  type BrowserWindowConstructorOptions,
  globalShortcut,
  nativeTheme,
  net,
  safeStorage,
  shell,
} from 'electron';
import log from 'electron-log';
import { menubar } from 'menubar';

import { initialize } from '@aptabase/electron/main';

import { APPLICATION } from '../shared/constants';
import {
  EVENTS,
  type IAutoLaunch,
  type IKeyboardShortcut,
  type IOpenExternal,
} from '../shared/events';
import { logError, logWarn } from '../shared/logger';
import { Theme } from '../shared/theme';

import { handleMainEvent, onMainEvent, sendRendererEvent } from './events';
import { onFirstRunMaybe } from './first-run';
import { TrayIcons } from './icons';
import MenuBuilder from './menu';
import AppUpdater from './updater';

log.initialize();

const aptabaseKey = process.env.APTABASE_KEY;
if (!aptabaseKey) {
  logError(
    'main:initialize',
    'APTABASE_KEY environment variable is not set',
    new Error('APTABASE_KEY environment variable is not set'),
  );
}
initialize(aptabaseKey);

/**
 * File paths
 */
const preloadFilePath = path.join(__dirname, 'preload.js');
const indexHtmlFilePath = `file://${__dirname}/index.html`;
const notificationSoundFilePath = path.join(
  __dirname,
  '..',
  'assets',
  'sounds',
  APPLICATION.NOTIFICATION_SOUND,
);
const twemojiDirPath = path.join(__dirname, 'images', 'twemoji');

const browserWindowOpts: BrowserWindowConstructorOptions = {
  width: 500,
  height: 400,
  minWidth: 500,
  minHeight: 400,
  resizable: false,
  skipTaskbar: true, // Hide the app from the Windows taskbar
  webPreferences: {
    preload: preloadFilePath,
    contextIsolation: true,
    nodeIntegration: false,
  },
};

const mb = menubar({
  icon: TrayIcons.idle,
  index: indexHtmlFilePath,
  browserWindow: browserWindowOpts,
  preloadWindow: true,
  showDockIcon: false, // Hide the app from the macOS dock
});

const menuBuilder = new MenuBuilder(mb);
const contextMenu = menuBuilder.buildMenu();

const appUpdater = new AppUpdater(mb, menuBuilder);

let shouldUseAlternateIdleIcon = false;
let shouldUseUnreadActiveIcon = true;

app.whenReady().then(async () => {
  preventSecondInstance();

  await onFirstRunMaybe();

  appUpdater.start();

  mb.on('ready', () => {
    mb.app.setAppUserModelId(APPLICATION.ID);

    // Tray configuration
    mb.tray.setToolTip(APPLICATION.NAME);
    mb.tray.setIgnoreDoubleClickEvents(true);
    mb.tray.on('right-click', (_event, bounds) => {
      mb.tray.popUpContextMenu(contextMenu, { x: bounds.x, y: bounds.y });
    });

    // Custom window key event
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
      sendRendererEvent(mb, EVENTS.UPDATE_THEME, Theme.DARK);
    } else {
      sendRendererEvent(mb, EVENTS.UPDATE_THEME, Theme.LIGHT);
    }
  });

  /**
   * Atlassify custom IPC events - no response expected
   */
  onMainEvent(EVENTS.WINDOW_SHOW, () => mb.showWindow());

  onMainEvent(EVENTS.WINDOW_HIDE, () => mb.hideWindow());

  onMainEvent(EVENTS.QUIT, () => mb.app.quit());

  onMainEvent(EVENTS.OPEN_EXTERNAL, (_, { url, activate }: IOpenExternal) =>
    shell.openExternal(url, { activate: activate }),
  );

  onMainEvent(
    EVENTS.USE_ALTERNATE_IDLE_ICON,
    (_, useAlternateIdleIcon: boolean) => {
      shouldUseAlternateIdleIcon = useAlternateIdleIcon;
    },
  );

  onMainEvent(
    EVENTS.USE_UNREAD_ACTIVE_ICON,
    (_, useUnreadActiveIcon: boolean) => {
      shouldUseUnreadActiveIcon = useUnreadActiveIcon;
    },
  );

  onMainEvent(EVENTS.UPDATE_ICON_COLOR, (_, notificationsCount: number) => {
    if (!mb.tray.isDestroyed()) {
      if (!net.isOnline()) {
        setOfflineIcon();
        return;
      }

      if (notificationsCount < 0) {
        setErrorIcon();
        return;
      }

      if (notificationsCount > 0) {
        setActiveIcon();
        return;
      }

      setIdleIcon();
    }
  });

  onMainEvent(EVENTS.UPDATE_ICON_TITLE, (_, title: string) => {
    if (!mb.tray.isDestroyed()) {
      mb.tray.setTitle(title);
    }
  });

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

  onMainEvent(EVENTS.UPDATE_AUTO_LAUNCH, (_, settings: IAutoLaunch) => {
    app.setLoginItemSettings(settings);
  });

  /**
   * Atlassify custom IPC events - response expected
   */

  handleMainEvent(EVENTS.VERSION, () => app.getVersion());

  handleMainEvent(EVENTS.NOTIFICATION_SOUND_PATH, () => {
    return notificationSoundFilePath;
  });

  handleMainEvent(EVENTS.TWEMOJI_DIRECTORY, () => {
    return twemojiDirPath;
  });

  handleMainEvent(EVENTS.SAFE_STORAGE_ENCRYPT, (_, value: string) => {
    return safeStorage.encryptString(value).toString('base64');
  });

  handleMainEvent(EVENTS.SAFE_STORAGE_DECRYPT, (_, value: string) => {
    return safeStorage.decryptString(Buffer.from(value, 'base64'));
  });
});

function setIdleIcon() {
  if (shouldUseAlternateIdleIcon) {
    mb.tray.setImage(TrayIcons.idleAlternate);
  } else {
    mb.tray.setImage(TrayIcons.idle);
  }
}

function setActiveIcon() {
  if (shouldUseUnreadActiveIcon) {
    mb.tray.setImage(TrayIcons.active);
  } else {
    setIdleIcon();
  }
}

function setErrorIcon() {
  mb.tray.setImage(TrayIcons.error);
}

function setOfflineIcon() {
  mb.tray.setImage(TrayIcons.offline);
}

/**
 * Prevent second instances
 */
function preventSecondInstance() {
  const gotTheLock = app.requestSingleInstanceLock();

  if (!gotTheLock) {
    logWarn('main:gotTheLock', 'Second instance detected, quitting');
    app.quit();
    return;
  }

  // When a second instance is launched, focus/show the existing menubar window
  app.on('second-instance', () => {
    mb.showWindow();
  });
}
