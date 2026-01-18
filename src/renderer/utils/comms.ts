import { defaultSettings } from '../context/defaults';

import { type Link, OpenPreference } from '../types';

import { loadState } from './storage';

export function openExternalLink(url: Link): void {
  // Load the state from local storage to avoid having to pass settings as a parameter
  const { settings } = loadState();
  const openPreference = settings
    ? settings.openLinks
    : defaultSettings.openLinks;

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
export function updateTrayColor(notificationsLength: number): void {
  window.atlassify.tray.updateColor(notificationsLength);
}

/**
 * Updates the tray icon title.
 *
 * @param title The title to set on the tray icon
 */
export function updateTrayTitle(title: string): void {
  window.atlassify.tray.updateTitle(title);
}
