import { ipcRenderer } from 'electron';

import type { EventData, EventType } from '../shared/events';

/**
 * Send renderer event without expecting a response
 * @param event the type of event to send
 * @param data the data to send with the event
 */
export function sendMainEvent(event: EventType, data?: EventData): void {
  ipcRenderer.send(event, data);
}

/**
 * Invoke main process handler and expect a response
 * @param event the type of event to invoke
 * @param data the data to send with the event
 * @returns Promise resolving to the response
 */
export async function invokeMainEvent<T = string>(
  event: EventType,
  data?: EventData,
): Promise<T> {
  try {
    return await ipcRenderer.invoke(event, data);
  } catch (err) {
    // biome-ignore lint/suspicious/noConsole: preload environment is strictly sandboxed
    console.error(`[IPC] invoke failed: ${event}`, err);
    throw err;
  }
}

/**
 * Handle renderer event without expecting a response
 */
export function onRendererEvent(
  event: EventType,
  listener: (event: Electron.IpcRendererEvent, args: string) => void,
) {
  ipcRenderer.on(event, listener);
}
