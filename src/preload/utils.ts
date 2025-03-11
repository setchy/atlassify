import { ipcRenderer } from 'electron';
import type { EventType } from '../main/events';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function sendEvent(event: EventType, data?: any): void {
  ipcRenderer.send(event, data);
}
