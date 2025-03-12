import { contextBridge, webFrame } from "electron";

import { isLinux, isMacOS, isWindows } from "../main/process";
import { type Link, OpenPreference } from "../renderer/types";
import { APPLICATION } from "../shared/constants";
import { invokeMainEvent, onRendererEvent, sendMainEvent } from "./utils";

const api = {
	openExternalLink: (url: Link, openPreference: OpenPreference) => {
		sendMainEvent("atlassify:open-external", {
			url: url,
			activate: openPreference === OpenPreference.FOREGROUND,
		});
	},

	getAppVersion: async () => {
		if (process.env.NODE_ENV === "development") {
			return "dev";
		}

		const version = await invokeMainEvent("atlassify:version");

		return `v${version}`;
	},

	encryptValue: (value: string) =>
		invokeMainEvent("atlassify:safe-storage-encrypt", value),

	decryptValue: (value: string) =>
		invokeMainEvent("atlassify:safe-storage-decrypt", value),

	setAutoLaunch: (value: boolean) =>
		sendMainEvent("atlassify:update-auto-launch", {
			openAtLogin: value,
			openAsHidden: value,
		}),

	setKeyboardShortcut: (keyboardShortcut: boolean) => {
		sendMainEvent("atlassify:update-keyboard-shortcut", {
			enabled: keyboardShortcut,
			keyboardShortcut: APPLICATION.DEFAULT_KEYBOARD_SHORTCUT,
		});
	},

	tray: {
		updateIcon: (notificationsLength = 0) => {
			if (notificationsLength < 0) {
				sendMainEvent("atlassify:icon-error");
				return;
			}

			if (notificationsLength > 0) {
				sendMainEvent("atlassify:icon-active");
				return;
			}

			sendMainEvent("atlassify:icon-idle");
		},

		updateTitle: (title = "") => sendMainEvent("atlassify:update-title", title),

		useAlternateIdleIcon: (value: boolean) =>
			sendMainEvent("atlassify:use-alternate-idle-icon", value),
	},

	notificationSoundPath: () =>
		invokeMainEvent("atlassify:notification-sound-path"),

	platform: {
		isLinux: () => isLinux(),

		isMacOS: () => isMacOS(),

		isWindows: () => isWindows(),
	},

	app: {
		hide: () => sendMainEvent("atlassify:window-hide"),

		show: () => sendMainEvent("atlassify:window-show"),

		quit: () => sendMainEvent("atlassify:quit"),
	},

	zoom: {
		getLevel: () => webFrame.getZoomLevel(),

		setLevel: (zoomLevel: number) => webFrame.setZoomLevel(zoomLevel),
	},

	onResetApp: (callback: () => void) => {
		onRendererEvent("atlassify:reset-app", () => callback());
	},

	onSystemThemeUpdate: (callback: (theme: string) => void) => {
		onRendererEvent("atlassify:update-theme", (_, theme) => callback(theme));
	},
};

contextBridge.exposeInMainWorld("atlassify", api);

export type AtlassifyAPI = typeof api;
