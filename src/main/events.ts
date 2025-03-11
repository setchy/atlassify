import { ipcMain as ipc } from 'electron';

export type EventType =
  | 'atlassify:quit'
  | 'atlassify:window-show'
  | 'atlassify:window-hide'
  | 'atlassify:version';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function onEvent(event: EventType, listener: (...args: any[]) => void) {
  ipc.on(event, listener);
}
export function handleEvent(
  event: EventType,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  listener: (...args: any[]) => void,
) {
  ipc.handle(event, listener);
}
