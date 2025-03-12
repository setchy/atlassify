import { ipcMain as ipc } from "electron";
import type { EventData, EventType } from "../shared/events";

/**
 * Handle main event without expecting a response
 * @param event
 * @param listener
 */
export function onEvent(
	event: EventType,
	listener: (event: Electron.IpcMainEvent, args: EventData) => void,
) {
	ipc.on(event, listener);
}

/**
 * Handle main event and return a response
 * @param event
 * @param listener
 */
export function handleEvent(
	event: EventType,
	listener: (event: Electron.IpcMainInvokeEvent, data: EventData) => void,
) {
	ipc.handle(event, listener);
}
