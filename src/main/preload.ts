import { contextBridge, ipcRenderer, shell, webFrame } from "electron";

import { type Link, OpenPreference } from "../renderer/types";
import { APPLICATION } from "../shared/constants";
import { namespacedEvent } from "../shared/events";
import { isLinux, isMacOS, isWindows } from "./platform";

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
		return ipcRenderer.invoke(namespacedEvent("version"));
	},

	encryptValue: (value: string) =>
		ipcRenderer.invoke(namespacedEvent("safe-storage-encrypt"), value),

	decryptValue: (value: string) =>
		ipcRenderer.invoke(namespacedEvent("safe-storage-decrypt"), value),

	quitApp: () => ipcRenderer.send(namespacedEvent("quit")),

	showWindow: () => ipcRenderer.send(namespacedEvent("window-show")),

	hideWindow: () => ipcRenderer.send(namespacedEvent("window-hide")),

	setAutoLaunch: (value: boolean) =>
		ipcRenderer.send(namespacedEvent("update-auto-launch"), {
			openAtLogin: value,
			openAsHidden: value,
		}),

	setAlternateIdleIcon: (value: boolean) =>
		ipcRenderer.send(namespacedEvent("use-alternate-idle-icon"), value),

	setKeyboardShortcut: (keyboardShortcut: boolean) => {
		ipcRenderer.send(namespacedEvent("update-keyboard-shortcut"), {
			enabled: keyboardShortcut,
			keyboardShortcut: APPLICATION.DEFAULT_KEYBOARD_SHORTCUT,
		});
	},

	updateTrayIcon: (notificationsLength = 0) => {
		if (notificationsLength < 0) {
			ipcRenderer.send(namespacedEvent("icon-error"));
			return;
		}

		if (notificationsLength > 0) {
			ipcRenderer.send(namespacedEvent("icon-active"));
			return;
		}

		ipcRenderer.send(namespacedEvent("icon-idle"));
	},

	updateTrayTitle: (title = "") =>
		ipcRenderer.send(namespacedEvent("update-title"), title),

	isLinux: () => {
		return isLinux();
	},

	isMacOS: () => {
		return isMacOS();
	},

	isWindows: () => {
		return isWindows();
	},

	notificationSoundPath: () =>
		ipcRenderer.invoke(namespacedEvent("notification-sound-path")),

	getZoomLevel: () => webFrame.getZoomLevel(),

	setZoomLevel: (zoomLevel: number) => webFrame.setZoomLevel(zoomLevel),
};

contextBridge.exposeInMainWorld("atlassify", api);

export type AtlassifyAPI = typeof api;
