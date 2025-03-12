import { contextBridge, webFrame } from "electron";

import { isLinux, isMacOS, isWindows } from "../main/process";
import { type Link, OpenPreference } from "../renderer/types";
import { APPLICATION } from "../shared/constants";
import { invokeEvent, sendEvent } from "./utils";

const api = {
	openExternalLink: (url: Link, openPreference: OpenPreference) => {
		sendEvent("atlassify:open-external", {
			url: url,
			activate: openPreference === OpenPreference.FOREGROUND,
		});
	},

	getAppVersion: async () => {
		if (process.env.NODE_ENV === "development") {
			return "dev";
		}

		const version = await invokeEvent("atlassify:version");

		return `v${version}`;
	},

	encryptValue: (value: string) =>
		invokeEvent("atlassify:safe-storage-encrypt", value),

	decryptValue: (value: string) =>
		invokeEvent("atlassify:safe-storage-decrypt", value),

	setAutoLaunch: (value: boolean) =>
		sendEvent("atlassify:update-auto-launch", {
			openAtLogin: value,
			openAsHidden: value,
		}),

	setKeyboardShortcut: (keyboardShortcut: boolean) => {
		sendEvent("atlassify:update-keyboard-shortcut", {
			enabled: keyboardShortcut,
			keyboardShortcut: APPLICATION.DEFAULT_KEYBOARD_SHORTCUT,
		});
	},

	tray: {
		updateIcon: (notificationsLength = 0) => {
			if (notificationsLength < 0) {
				sendEvent("atlassify:icon-error");
				return;
			}

			if (notificationsLength > 0) {
				sendEvent("atlassify:icon-active");
				return;
			}

			sendEvent("atlassify:icon-idle");
		},

		updateTitle: (title = "") => sendEvent("atlassify:update-title", title),

		useAlternateIdleIcon: (value: boolean) =>
			sendEvent("atlassify:use-alternate-idle-icon", value),
	},

	notificationSoundPath: () => invokeEvent("atlassify:notification-sound-path"),

	platform: {
		isLinux: () => isLinux(),

		isMacOS: () => isMacOS(),

		isWindows: () => isWindows(),
	},

	app: {
		hide: () => sendEvent("atlassify:window-hide"),

		show: () => sendEvent("atlassify:window-show"),

		quit: () => sendEvent("atlassify:quit"),
	},

	zoom: {
		getLevel: () => webFrame.getZoomLevel(),

		setLevel: (zoomLevel: number) => webFrame.setZoomLevel(zoomLevel),
	},
};

contextBridge.exposeInMainWorld("atlassify", api);

export type AtlassifyAPI = typeof api;
