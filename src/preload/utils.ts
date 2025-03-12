import { ipcRenderer } from "electron";
import type { EventData, EventType } from "../shared/events";

/**
 * Send renderer event without expecting a response
 * @param event the type of event to send
 * @param data the data to send with the event
 */
export function sendEvent(event: EventType, data?: EventData): void {
	ipcRenderer.send(event, data);
}

/**
 * Send renderer event and expect a response
 * @param event the type of event to send
 * @param data the data to send with the event
 * @returns
 */
export function invokeEvent(event: EventType, data?: string): Promise<string> {
	return ipcRenderer.invoke(event, data);
}
