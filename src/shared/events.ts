import { APPLICATION } from './constants';

const P = APPLICATION.EVENT_PREFIX;

/**
 * IPC event name constants for all Electron main ↔ renderer communication channels.
 * Each value is prefixed with `APPLICATION.EVENT_PREFIX` to prevent collisions.
 */
export const EVENTS = {
  QUIT: `${P}quit`,
  WINDOW_SHOW: `${P}window-show`,
  WINDOW_HIDE: `${P}window-hide`,
  VERSION: `${P}version`,
  UPDATE_ICON_COLOR: `${P}update-icon-color`,
  UPDATE_ICON_TITLE: `${P}update-icon-title`,
  UPDATE_KEYBOARD_SHORTCUT: `${P}update-keyboard-shortcut`,
  UPDATE_AUTO_LAUNCH: `${P}update-auto-launch`,
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
