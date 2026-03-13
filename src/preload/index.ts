import { contextBridge, webFrame } from 'electron';

import { APPLICATION } from '../shared/constants';
import {
  EVENTS,
  type TrayAppState,
  type TrayIdleIconVariant,
  type TrayUnreadIconVariant,
} from '../shared/events';
import { isLinux, isMacOS, isWindows } from '../shared/platform';

import { invokeMainEvent, onRendererEvent, sendMainEvent } from './utils';

/**
 * The Atlassify Bridge API exposed to the renderer process via `contextBridge`.
 * Provides a safe, sandboxed interface for IPC communication between renderer and main.
 * Accessible as `window.atlassify` in the renderer.
 */
export const api = {
  /** Opens a URL in the system default browser. Only HTTPS URLs are forwarded. */
  openExternalLink: (url: string, openInForeground: boolean) => {
    sendMainEvent(EVENTS.OPEN_EXTERNAL, {
      url: url,
      activate: openInForeground,
    });
  },

  /** Encrypts a plaintext string using Electron's safeStorage. */
  encryptValue: (value: string) =>
    invokeMainEvent(EVENTS.SAFE_STORAGE_ENCRYPT, value),

  /** Decrypts a previously encrypted string using Electron's safeStorage. */
  decryptValue: (value: string) =>
    invokeMainEvent(EVENTS.SAFE_STORAGE_DECRYPT, value),

  /** Enables or disables auto-launch of the application on system startup. */
  setAutoLaunch: (value: boolean) =>
    sendMainEvent(EVENTS.UPDATE_AUTO_LAUNCH, {
      openAtLogin: value,
      openAsHidden: value,
    }),

  /** Registers or unregisters the global keyboard shortcut to toggle the application window. */
  setKeyboardShortcut: (keyboardShortcut: boolean) => {
    sendMainEvent(EVENTS.UPDATE_KEYBOARD_SHORTCUT, {
      enabled: keyboardShortcut,
      keyboardShortcut: APPLICATION.DEFAULT_KEYBOARD_SHORTCUT,
    });
  },

  /** Tray icon controls. */
  tray: {
    updateColor: (
      notificationsCount,
      appState: TrayAppState,
      idleIconVariant: TrayIdleIconVariant,
      unreadIconVariant: TrayUnreadIconVariant,
    ) => {
      sendMainEvent(EVENTS.UPDATE_ICON_COLOR, {
        notificationsCount,
        appState,
        idleIconVariant,
        unreadIconVariant,
      });
    },

    updateTitle: (title = '') => sendMainEvent(EVENTS.UPDATE_ICON_TITLE, title),
  },

  /** Returns the absolute path to the notification sound file. */
  notificationSoundPath: () => invokeMainEvent(EVENTS.NOTIFICATION_SOUND_PATH),

  /** Returns the absolute path to the local Twemoji SVG asset directory. */
  twemojiDirectory: () => invokeMainEvent(EVENTS.TWEMOJI_DIRECTORY),

  /** Platform detection helpers (replicates Node.js `process.platform` checks in the sandboxed renderer). */
  platform: {
    isLinux: () => isLinux(),

    isMacOS: () => isMacOS(),

    isWindows: () => isWindows(),
  },

  /** Application lifecycle controls. */
  app: {
    hide: () => sendMainEvent(EVENTS.WINDOW_HIDE),

    show: () => sendMainEvent(EVENTS.WINDOW_SHOW),

    quit: () => sendMainEvent(EVENTS.QUIT),

    version: async () => {
      if (process.env.NODE_ENV === 'development') {
        return 'dev';
      }

      const version = await invokeMainEvent(EVENTS.VERSION);

      return `v${version}`;
    },
  },

  /** Electron `webFrame` zoom controls. */
  zoom: {
    getLevel: () => webFrame.getZoomLevel(),

    setLevel: (zoomLevel: number) => webFrame.setZoomLevel(zoomLevel),
  },

  /** Registers a callback invoked when the main process requests a full app reset. */
  onResetApp: (callback: () => void) => {
    onRendererEvent(EVENTS.RESET_APP, () => callback());
  },

  /** Registers a callback invoked when the OS system theme changes. */
  onSystemThemeUpdate: (callback: (theme: string) => void) => {
    onRendererEvent(EVENTS.UPDATE_THEME, (_, theme) => callback(theme));
  },

  /** Raises a native OS notification. Clicking opens the entity URL or shows the app window. */
  raiseNativeNotification: (title: string, body: string, url?: string) => {
    const notification = new Notification(title, { body: body, silent: true });
    notification.onclick = () => {
      if (url) {
        api.app.hide();
        api.openExternalLink(url, true);
      } else {
        api.app.show();
      }
    };

    return notification;
  },

  /** Aptabase analytics helpers. */
  aptabase: {
    trackEvent: (
      eventName: string,
      props?: Record<string, string | number | boolean>,
    ) => sendMainEvent(EVENTS.APTABASE_TRACK_EVENT, { eventName, props }),
  },
};

// Use `contextBridge` APIs to expose Electron APIs to renderer
// Context isolation is always enabled in this app
try {
  contextBridge.exposeInMainWorld('atlassify', api);
} catch (err) {
  // biome-ignore lint/suspicious/noConsole: preload environment is strictly sandboxed
  console.error(
    '[preload] Failed to expose Atlassify Bridge API to renderer',
    err,
  );
}
