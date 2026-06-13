import { APPLICATION } from './constants';

import type { Theme } from './theme';

const P = APPLICATION.EVENT_PREFIX;

/**
 * IPC event name constants for all Electron main ↔ renderer communication channels.
 * Each value is prefixed with `APPLICATION.EVENT_PREFIX` to prevent collisions.
 */
export const EVENTS = {
  SYSTEM_WAKE: `${P}system-wake`,
  QUIT: `${P}quit`,
  WINDOW_SHOW: `${P}window-show`,
  WINDOW_HIDE: `${P}window-hide`,
  VERSION: `${P}version`,
  UPDATE_ICON_COLOR: `${P}update-icon-color`,
  UPDATE_ICON_TITLE: `${P}update-icon-title`,
  UPDATE_KEYBOARD_SHORTCUT: `${P}update-keyboard-shortcut`,
  UPDATE_AUTO_LAUNCH: `${P}update-auto-launch`,
  UPDATE_KEEP_WINDOW_ON_BLUR: `${P}update-keep-window-on-blur`,
  SAFE_STORAGE_ENCRYPT: `${P}safe-storage-encrypt`,
  SAFE_STORAGE_DECRYPT: `${P}safe-storage-decrypt`,
  NOTIFICATION_SOUND_PATH: `${P}notification-sound-path`,
  OPEN_EXTERNAL: `${P}open-external`,
  RESET_APP: `${P}reset-app`,
  UPDATE_THEME: `${P}update-theme`,
  TWEMOJI_DIRECTORY: `${P}twemoji-directory`,
  APTABASE_TRACK_EVENT: `${P}aptabase-track-event`,
} as const;

/** Union type of all valid IPC event name strings. */
export type EventType = (typeof EVENTS)[keyof typeof EVENTS];

/** Payload for the `UPDATE_AUTO_LAUNCH` event. */
export interface IAutoLaunch {
  openAtLogin: boolean;
  openAsHidden: boolean;
}

/** Payload for the `UPDATE_KEYBOARD_SHORTCUT` event. */
export interface IKeyboardShortcut {
  enabled: boolean;
  keyboardShortcut: string;
}

/** Result of applying the global open/close Gitify shortcut in the main process. */
export interface IKeyboardShortcutResult {
  success: boolean;
}

/** Payload for the `OPEN_EXTERNAL` event. */
export interface IOpenExternal {
  url: string;
  activate: boolean;
}

/** Payload for the `APTABASE_TRACK_EVENT` event. */
export interface IAptabaseEvent {
  eventName: string;
  props?: Record<string, string | number | boolean>;
}

/**
 * Result of decrypting a value via Electron's safe storage.
 *
 * `reEncryptedToken` is set when the OS keychain rotated keys during decrypt
 * (signaled by `safeStorage.decryptStringAsync`'s `shouldReEncrypt` flag).
 * Callers that persist the original ciphertext should overwrite it with the
 * new value so future sessions stay aligned with the active keychain key.
 */
export interface ISafeStorageDecryptResult {
  token: string;
  reEncryptedToken?: string;
}

/** The current connectivity and error state used to determine the tray icon appearance. */
export type TrayAppState = 'online' | 'offline' | 'error';
/** Which idle tray icon variant to display when there are no unread notifications. */
export type TrayIdleIconVariant = 'default' | 'alternative';
/** Whether to show the active (colored) or idle tray icon when there are unread notifications. */
export type TrayUnreadIconVariant = 'active' | 'idle';

/** Payload for the `UPDATE_ICON_COLOR` event. */
export interface ITrayColorUpdate {
  notificationsCount: number;
  appState: TrayAppState;
  idleIconVariant: TrayIdleIconVariant;
  unreadIconVariant: TrayUnreadIconVariant;
}

/** Union of all possible IPC event payload types. */
export type EventData =
  | string
  | number
  | boolean
  | IKeyboardShortcut
  | IAutoLaunch
  | IOpenExternal
  | IAptabaseEvent
  | ITrayColorUpdate;

/** Shape of a single event contract: a request payload and a response payload. */
type Contract = { request: unknown; response: unknown };

/**
 * Type-level guard that forces every event in `EVENTS` to have a contract entry.
 * If a key is missing, this constraint fails at compile time.
 */
type AssertEventCoverage<T extends Record<EventType, Contract>> = T;

/**
 * Compile-time contract for every IPC event: request payload type and response type.
 *
 * - For `handle`/`invoke` pairs, `response` is the return type the renderer awaits.
 * - For fire-and-forget events (`send`/`on`), `response` is `undefined`.
 * - For events with no payload, `request` is `undefined`.
 */
export type EventContracts = AssertEventCoverage<{
  [EVENTS.SYSTEM_WAKE]: { request: undefined; response: undefined };
  [EVENTS.QUIT]: { request: undefined; response: undefined };
  [EVENTS.WINDOW_SHOW]: { request: undefined; response: undefined };
  [EVENTS.WINDOW_HIDE]: { request: undefined; response: undefined };
  [EVENTS.VERSION]: { request: undefined; response: string };
  [EVENTS.UPDATE_ICON_COLOR]: {
    request: ITrayColorUpdate;
    response: undefined;
  };
  [EVENTS.UPDATE_ICON_TITLE]: { request: string; response: undefined };
  [EVENTS.UPDATE_KEYBOARD_SHORTCUT]: {
    request: IKeyboardShortcut;
    response: IKeyboardShortcutResult;
  };
  [EVENTS.UPDATE_AUTO_LAUNCH]: { request: IAutoLaunch; response: undefined };
  [EVENTS.UPDATE_KEEP_WINDOW_ON_BLUR]: {
    request: boolean;
    response: undefined;
  };
  [EVENTS.SAFE_STORAGE_ENCRYPT]: { request: string; response: string };
  [EVENTS.SAFE_STORAGE_DECRYPT]: {
    request: string;
    response: string;
  };
  [EVENTS.NOTIFICATION_SOUND_PATH]: { request: undefined; response: string };
  [EVENTS.OPEN_EXTERNAL]: { request: IOpenExternal; response: undefined };
  [EVENTS.RESET_APP]: { request: undefined; response: undefined };
  [EVENTS.UPDATE_THEME]: { request: Theme; response: undefined };
  [EVENTS.TWEMOJI_DIRECTORY]: { request: undefined; response: string };
  [EVENTS.APTABASE_TRACK_EVENT]: {
    request: IAptabaseEvent;
    response: undefined;
  };
}>;

/** Request payload type for a given event. */
export type EventRequest<E extends EventType> = EventContracts[E]['request'];

/** Response payload type for a given event. */
export type EventResponse<E extends EventType> = EventContracts[E]['response'];

/**
 * Variadic args helper: yields `[]` when the event has no request payload,
 * otherwise `[request]`. Lets callers write `send(EVENTS.QUIT)` instead of
 * `send(EVENTS.QUIT, undefined)`.
 */
export type EventArgs<E extends EventType> = [EventRequest<E>] extends [
  undefined,
]
  ? []
  : [EventRequest<E>];
