import { OpenPreference } from '../stores/types';
import useSettingsStore from '../stores/useSettingsStore';

import type { Link } from '../types';

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

export function setUseAlternateIdleIcon(value: boolean): void {
  window.atlassify.tray.useAlternateIdleIcon(value);
}

export function setUseUnreadActiveIcon(value: boolean): void {
  window.atlassify.tray.useUnreadActiveIcon(value);
}

export function setKeyboardShortcut(keyboardShortcut: boolean): void {
  window.atlassify.setKeyboardShortcut(keyboardShortcut);
}

/**
 * Updates the tray icon color based on the number of unread notifications.
 *
 * Passing a negative number will set the error state color.
 *
 * @param notificationsLength The number of unread notifications
 */
export function updateTrayColor(
  notificationsLength: number,
  isOnline: boolean,
): void {
  window.atlassify.tray.updateColor(notificationsLength, isOnline);
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
