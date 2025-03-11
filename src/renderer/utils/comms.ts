import { defaultSettings } from '../context/App';
import type { Link } from '../types';
import { loadState } from './storage';

export function openExternalLink(url: Link): void {
  // Load the state from local storage to avoid having to pass settings as a parameter
  const { settings } = loadState();
  const openPreference = settings
    ? settings.openLinks
    : defaultSettings.openLinks;

  if (url.toLowerCase().startsWith('https://')) {
    window.atlassify.openExternalLink(url, openPreference);
  }
}

export async function getAppVersion(): Promise<string> {
  return await window.atlassify.getAppVersion();
}

export async function encryptValue(value: string): Promise<string> {
  return await window.atlassify.encryptValue(value);
}

export async function decryptValue(value: string): Promise<string> {
  return await window.atlassify.decryptValue(value);
}

export function quitApp(): void {
  window.atlassify.quitApp();
}

export function showWindow(): void {
  window.atlassify.showWindow();
}

export function hideWindow(): void {
  window.atlassify.hideWindow();
}

export function setAutoLaunch(value: boolean): void {
  window.atlassify.setAutoLaunch(value);
}

export function setAlternateIdleIcon(value: boolean): void {
  window.atlassify.setAlternateIdleIcon(value);
}

export function setKeyboardShortcut(keyboardShortcut: boolean): void {
  window.atlassify.setKeyboardShortcut(keyboardShortcut);
}

export function updateTrayIcon(notificationsLength = 0): void {
  window.atlassify.updateTrayIcon(notificationsLength);
}

export function updateTrayTitle(title = ''): void {
  window.atlassify.updateTrayTitle(title);
}
