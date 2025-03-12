import type { Link } from "../renderer/types";
import { APPLICATION } from "./constants";

export type EventType =
	| "atlassify:icon-idle"
	| "atlassify:icon-active"
	| "atlassify:icon-error"
	| "atlassify:quit"
	| "atlassify:window-show"
	| "atlassify:window-hide"
	| "atlassify:version"
	| "atlassify:update-title"
	| "atlassify:use-alternate-idle-icon"
	| "atlassify:update-keyboard-shortcut"
	| "atlassify:update-auto-launch"
	| "atlassify:safe-storage-encrypt"
	| "atlassify:safe-storage-decrypt"
	| "atlassify:notification-sound-path"
	| "atlassify:open-external";

export interface IAutoLaunch {
	openAtLogin: boolean;
	openAsHidden: boolean;
}

export interface IKeyboardShortcut {
	enabled: boolean;
	keyboardShortcut: string;
}

export interface IOpenExternal {
	url: Link;
	activate: boolean;
}

export type EventData =
	| string
	| boolean
	| IKeyboardShortcut
	| IAutoLaunch
	| IOpenExternal;

export function namespacedEvent(event: string) {
	return `${APPLICATION.EVENT_PREFIX}${event}`;
}
