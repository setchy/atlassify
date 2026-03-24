import type {
  TrayAppState,
  TrayIdleIconVariant,
  TrayUnreadIconVariant,
} from '../../../shared/events';

import { OpenPreference, useSettingsStore } from '../../stores';

import type { Link } from '../../types';

/**
 * Opens an external link in the user's browser.
 * Only HTTPS URLs are opened; the open preference (foreground/background) is read from settings.
 *
 * @param url - The HTTPS URL to open.
 */
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

/**
 * Returns the current application version string.
 *
 * @returns Promise resolving to the app version (e.g. `"3.5.1"`).
 */
export async function getAppVersion(): Promise<string> {
  return await window.atlassify.app.version();
}

/**
 * Encrypts a plaintext string using the native Electron encryption bridge.
 *
 * @param value - The plaintext string to encrypt.
 * @returns Promise resolving to the encrypted string.
 */
export async function encryptValue(value: string): Promise<string> {
  return await window.atlassify.encryptValue(value);
}

/**
 * Decrypts a previously encrypted string using the native Electron decryption bridge.
 *
 * @param value - The encrypted string to decrypt.
 * @returns Promise resolving to the decrypted plaintext string.
 */
export async function decryptValue(value: string): Promise<string> {
  return await window.atlassify.decryptValue(value);
}

/**
 * Quits the application.
 */
export function quitApp(): void {
  window.atlassify.app.quit();
}

/**
 * Shows the main application window.
 */
export function showWindow(): void {
  window.atlassify.app.show();
}

/**
 * Hides the main application window.
 */
export function hideWindow(): void {
  window.atlassify.app.hide();
}

/**
 * Enables or disables auto-launch of the application on system startup.
 *
 * @param value - `true` to enable auto-launch, `false` to disable.
 */
export function setAutoLaunch(value: boolean): void {
  window.atlassify.setAutoLaunch(value);
}

/**
 * Registers or unregisters the global keyboard shortcut to toggle the application window.
 *
 * @param keyboardShortcut - `true` to register the shortcut, `false` to unregister.
 */
export function setKeyboardShortcut(keyboardShortcut: boolean): void {
  window.atlassify.setKeyboardShortcut(keyboardShortcut);
}

/**
 * Updates the tray icon color based on the current notification and app state.
 *
 * @param notificationsCount The number of unread notifications
 * @param appState The current app state: online, offline, or error
 * @param idleIconVariant Which idle icon variant to display
 * @param unreadIconVariant Whether to show the active icon when there are unread notifications
 */
export function updateTrayColor(
  notificationsCount: number,
  appState: TrayAppState,
  idleIconVariant: TrayIdleIconVariant,
  unreadIconVariant: TrayUnreadIconVariant,
): void {
  window.atlassify.tray.updateColor(
    notificationsCount,
    appState,
    idleIconVariant,
    unreadIconVariant,
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
