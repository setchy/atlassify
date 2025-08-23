import { contextBridge, webFrame } from 'electron';

import { APPLICATION } from '../shared/constants';
import { logError } from '../shared/logger';
import { isLinux, isMacOS, isWindows } from '../shared/platform';
import { invokeMainEvent, onRendererEvent, sendMainEvent } from './utils';

export const api = {
  openExternalLink: (url: string, openInForeground: boolean) => {
    sendMainEvent('atlassify:open-external', {
      url: url,
      activate: openInForeground,
    });
  },

  encryptValue: (value: string) =>
    invokeMainEvent('atlassify:safe-storage-encrypt', value),

  decryptValue: (value: string) =>
    invokeMainEvent('atlassify:safe-storage-decrypt', value),

  setAutoLaunch: (value: boolean) =>
    sendMainEvent('atlassify:update-auto-launch', {
      openAtLogin: value,
      openAsHidden: value,
    }),

  setKeyboardShortcut: (keyboardShortcut: boolean) => {
    sendMainEvent('atlassify:update-keyboard-shortcut', {
      enabled: keyboardShortcut,
      keyboardShortcut: APPLICATION.DEFAULT_KEYBOARD_SHORTCUT,
    });
  },

  tray: {
    updateIcon: (notificationsLength = 0) => {
      if (notificationsLength < 0) {
        sendMainEvent('atlassify:icon-error');
        return;
      }

      if (notificationsLength > 0) {
        sendMainEvent('atlassify:icon-active');
        return;
      }

      sendMainEvent('atlassify:icon-idle');
    },

    updateTitle: (title = '') => sendMainEvent('atlassify:update-title', title),

    useAlternateIdleIcon: (value: boolean) =>
      sendMainEvent('atlassify:use-alternate-idle-icon', value),
  },

  notificationSoundPath: () =>
    invokeMainEvent('atlassify:notification-sound-path'),

  twemojiDirectory: () => invokeMainEvent('atlassify:twemoji-directory'),

  platform: {
    isLinux: () => isLinux(),

    isMacOS: () => isMacOS(),

    isWindows: () => isWindows(),
  },

  app: {
    hide: () => sendMainEvent('atlassify:window-hide'),

    show: () => sendMainEvent('atlassify:window-show'),

    quit: () => sendMainEvent('atlassify:quit'),

    version: async () => {
      if (process.env.NODE_ENV === 'development') {
        return 'dev';
      }

      const version = await invokeMainEvent('atlassify:version');

      return `v${version}`;
    },
  },

  zoom: {
    getLevel: () => webFrame.getZoomLevel(),

    setLevel: (zoomLevel: number) => webFrame.setZoomLevel(zoomLevel),
  },

  onResetApp: (callback: () => void) => {
    onRendererEvent('atlassify:reset-app', () => callback());
  },

  onSystemThemeUpdate: (callback: (theme: string) => void) => {
    onRendererEvent('atlassify:update-theme', (_, theme) => callback(theme));
  },

  raiseNativeNotification: (title: string, body: string, url?: string) => {
    const notification = new Notification(title, {
      body,
      silent: true,
    });

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
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('atlassify', api);
  } catch (error) {
    logError('preload', 'Failed to expose API to renderer', error);
  }
} else {
  window.atlassify = api;
}
