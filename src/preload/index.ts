import { contextBridge, ipcRenderer, shell, webFrame } from 'electron';

import { isLinux, isMacOS, isWindows } from '../main/platform';
import { type Link, OpenPreference } from '../renderer/types';
import { APPLICATION } from '../shared/constants';
import { namespacedEvent } from '../shared/events';
import { sendEvent } from './utils';

const api = {
  openExternalLink: (url: Link, openPreference: OpenPreference) => {
    shell.openExternal(url, {
      activate: openPreference === OpenPreference.FOREGROUND,
    });
  },

  getAppVersion: () => {
    // if (process.env.NODE_ENV === 'development') {
    //   return 'dev';
    // }

    // TODO - Return v{number}
    return ipcRenderer.invoke(namespacedEvent('version'));
  },

  encryptValue: (value: string) =>
    ipcRenderer.invoke(namespacedEvent('safe-storage-encrypt'), value),

  decryptValue: (value: string) =>
    ipcRenderer.invoke(namespacedEvent('safe-storage-decrypt'), value),

  setAutoLaunch: (value: boolean) =>
    ipcRenderer.send(namespacedEvent('update-auto-launch'), {
      openAtLogin: value,
      openAsHidden: value,
    }),

  setKeyboardShortcut: (keyboardShortcut: boolean) => {
    ipcRenderer.send(namespacedEvent('update-keyboard-shortcut'), {
      enabled: keyboardShortcut,
      keyboardShortcut: APPLICATION.DEFAULT_KEYBOARD_SHORTCUT,
    });
  },

  tray: {
    updateIcon: (notificationsLength = 0) => {
      if (notificationsLength < 0) {
        ipcRenderer.send(namespacedEvent('icon-error'));
        return;
      }

      if (notificationsLength > 0) {
        ipcRenderer.send(namespacedEvent('icon-active'));
        return;
      }

      ipcRenderer.send(namespacedEvent('icon-idle'));
    },

    updateTitle: (title = '') =>
      ipcRenderer.send(namespacedEvent('update-title'), title),

    useAlternateIdleIcon: (value: boolean) =>
      ipcRenderer.send(namespacedEvent('use-alternate-idle-icon'), value),
  },

  notificationSoundPath: () =>
    ipcRenderer.invoke(namespacedEvent('notification-sound-path')),

  platform: {
    isLinux: () => isLinux(),

    isMacOS: () => isMacOS(),

    isWindows: () => isWindows(),
  },

  app: {
    hide: () => ipcRenderer.send(namespacedEvent('window-hide')),

    show: () => ipcRenderer.send(namespacedEvent('window-show')),

    quit: () => sendEvent('atlassify:quit'),
  },

  zoom: {
    getLevel: () => webFrame.getZoomLevel(),

    setLevel: (zoomLevel: number) => webFrame.setZoomLevel(zoomLevel),
  },
};

contextBridge.exposeInMainWorld('atlassify', api);

export type AtlassifyAPI = typeof api;
