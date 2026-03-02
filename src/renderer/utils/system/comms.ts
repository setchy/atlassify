import type {
  TrayAppState,
  TrayIdleIconType,
  TrayUnreadIconStyle,
} from '../../../shared/events';

import { OpenPreference, useSettingsStore } from '../../stores';

import type { Link } from '../../types';

export function openExternalLink(url: Link): void {
  const settings = useSettingsStore.getState();
  const openPreference = settings.openLinks;

  if (url.toLowerCase().startsWith('https://')) {
    window.atlassify.openExternalLink(
      url,
      openPreference === OpenPreference.FOREGROUND,
    );
  }
}

export async function getAppVersion(): Promise<string> {
  return await window.atlassify.app.version();
}

export async function encryptValue(value: string): Promise<string> {
  return await window.atlassify.encryptValue(value);
}

export async function decryptValue(value: string): Promise<string> {
  return await window.atlassify.decryptValue(value);
}

export function quitApp(): void {
  window.atlassify.app.quit();
}

export function showWindow(): void {
  window.atlassify.app.show();
}

export function hideWindow(): void {
  window.atlassify.app.hide();
}

export function setAutoLaunch(value: boolean): void {
  window.atlassify.setAutoLaunch(value);
}

export function setKeyboardShortcut(keyboardShortcut: boolean): void {
  window.atlassify.setKeyboardShortcut(keyboardShortcut);
}

/**
 * Updates the tray icon color based on the current notification and app state.
 *
 * @param notificationsCount The number of unread notifications
 * @param appState The current app state: online, offline, or error
 * @param idleIconType Which idle icon variant to display
 * @param unreadIconStyle Whether to show the active icon when there are unread notifications
 */
export function updateTrayColor(
  notificationsCount: number,
  appState: TrayAppState,
  idleIconType: TrayIdleIconType,
  unreadIconStyle: TrayUnreadIconStyle,
): void {
  window.atlassify.tray.updateColor(
    notificationsCount,
    appState,
    idleIconType,
    unreadIconStyle,
  );
}

/**
 * Updates the tray icon title.
 *
 * @param title The title to set on the tray icon
 */
export function updateTrayTitle(title: string): void {
  window.atlassify.tray.updateTitle(title);
}

/**
 * Renderer app analytics events
 */
export function trackEvent(
  eventName: string,
  props?: Record<string, string | number | boolean>,
): void {
  window.atlassify.aptabase.trackEvent(eventName, props);
}
