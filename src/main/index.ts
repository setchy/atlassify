import path from "node:path";
import { app, globalShortcut, nativeTheme, safeStorage, shell } from "electron";
import log from "electron-log";
import { menubar } from "menubar";

import { APPLICATION } from "../shared/constants";
import {
	type IAutoLaunch,
	type IKeyboardShortcut,
	type IOpenExternal,
	namespacedEvent,
} from "../shared/events";

import { handleEvent, onEvent } from "./events";
import { onFirstRunMaybe } from "./first-run";
import { TrayIcons } from "./icons";
import MenuBuilder from "./menu";
import { isMacOS, isWindows } from "./process";
import Updater from "./updater";

log.initialize();

/**
 * File paths
 */
const preloadFilePath = path.join(__dirname, "preload.js");
const indexHtmlFilePath = `file://${__dirname}/index.html`;
const notificationSoundFilePath = path.join(
	__dirname,
	"..",
	"assets",
	"sounds",
	APPLICATION.NOTIFICATION_SOUND,
);

const browserWindowOpts: Electron.BrowserWindowConstructorOptions = {
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
		sandbox: true,
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

	mb.on("ready", () => {
		mb.app.setAppUserModelId(APPLICATION.ID);

		// Tray configuration
		mb.tray.setToolTip(APPLICATION.NAME);
		mb.tray.setIgnoreDoubleClickEvents(true);
		mb.tray.on("right-click", (_event, bounds) => {
			mb.tray.popUpContextMenu(contextMenu, { x: bounds.x, y: bounds.y });
		});

		// Custom window key event
		mb.window.webContents.on("before-input-event", (event, input) => {
			if (input.key === "Escape") {
				mb.window.hide();
				event.preventDefault();
			}
		});

		// DevTools configuration
		mb.window.webContents.on("devtools-opened", () => {
			mb.window.setSize(800, 600);
			mb.window.center();
			mb.window.resizable = true;
			mb.window.setAlwaysOnTop(true);
		});

		mb.window.webContents.on("devtools-closed", () => {
			const trayBounds = mb.tray.getBounds();
			mb.window.setSize(browserWindowOpts.width, browserWindowOpts.height);
			mb.positioner.move("trayCenter", trayBounds);
			mb.window.resizable = false;
		});
	});

	nativeTheme.on("updated", () => {
		if (nativeTheme.shouldUseDarkColors) {
			mb.window.webContents.send(namespacedEvent("update-theme"), "DARK");
		} else {
			mb.window.webContents.send(namespacedEvent("update-theme"), "LIGHT");
		}
	});

	/**
	 * Atlassify custom IPC events - no response expected
	 */
	onEvent("atlassify:window-show", () => mb.showWindow());

	onEvent("atlassify:window-hide", () => mb.hideWindow());

	onEvent("atlassify:quit", () => mb.app.quit());

	onEvent("atlassify:open-external", (_, { url, activate }: IOpenExternal) =>
		shell.openExternal(url, { activate: activate }),
	);

	onEvent(
		"atlassify:use-alternate-idle-icon",
		(_, useAlternateIdleIcon: boolean) => {
			shouldUseAlternateIdleIcon = useAlternateIdleIcon;
		},
	);

	onEvent("atlassify:icon-error", () => {
		if (!mb.tray.isDestroyed()) {
			mb.tray.setImage(TrayIcons.error);
		}
	});

	onEvent("atlassify:icon-active", () => {
		if (!mb.tray.isDestroyed()) {
			mb.tray.setImage(TrayIcons.active);
		}
	});

	onEvent("atlassify:icon-idle", () => {
		if (!mb.tray.isDestroyed()) {
			if (shouldUseAlternateIdleIcon) {
				mb.tray.setImage(TrayIcons.idleAlternate);
			} else {
				mb.tray.setImage(TrayIcons.idle);
			}
		}
	});

	onEvent("atlassify:update-title", (_, title: string) => {
		if (!mb.tray.isDestroyed()) {
			mb.tray.setTitle(title);
		}
	});

	onEvent(
		"atlassify:update-keyboard-shortcut",
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

	onEvent("atlassify:update-auto-launch", (_, settings: IAutoLaunch) => {
		app.setLoginItemSettings(settings);
	});

	/**
	 * Atlassify custom IPC events - response expected
	 */

	handleEvent("atlassify:version", () => app.getVersion());

	handleEvent("atlassify:notification-sound-path", () => {
		return notificationSoundFilePath;
	});

	handleEvent("atlassify:safe-storage-encrypt", (_, value: string) => {
		return safeStorage.encryptString(value).toString("base64");
	});

	handleEvent("atlassify:safe-storage-decrypt", (_, value: string) => {
		return safeStorage.decryptString(Buffer.from(value, "base64"));
	});
});
