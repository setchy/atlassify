import { defaultSettings } from '../context/defaults';

import { type Link, OpenPreference } from '../types';

import useAccountsStore from '../stores/useAccountsStore';
import useSettingsStore from '../stores/useSettingsStore';

export function openExternalLink(url: Link): void {
  // Load the settings from the store to avoid having to pass settings as a parameter
  const settings = useSettingsStore.getState();
  const openPreference = settings.openLinks ?? defaultSettings.openLinks;

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

/**
 * Get the decrypted token for an account.
 * Tokens are stored encrypted via electron's safeStorage and retrieved on demand.
 *
 * @param accountId The account ID to get the token for
 * @returns The decrypted token
 */
export async function getAccountToken(accountId: string): Promise<string> {
  const accounts = useAccountsStore.getState().accounts;
  const account = accounts.find((a) => a.id === accountId);

  if (!account?.token) {
    throw new Error(`No token found for account ${accountId}`);
  }

  // If token is already encrypted (starts with 'encrypted:'), decrypt it
  if (account.token.startsWith('encrypted:')) {
    const decrypted = await decryptValue(account.token);
    // The encrypted value includes the account ID prefix, extract just the token
    const [, token] = decrypted.split(':', 2);
    return token || decrypted;
  }

  // Otherwise return as-is (for backward compatibility during migration)
  return account.token;
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

/**
 * Renderer app analytics events
 */
export function trackEvent(
  eventName: string,
  props?: Record<string, string | number | boolean>,
): void {
  window.atlassify.aptabase.trackEvent(eventName, props);
}
