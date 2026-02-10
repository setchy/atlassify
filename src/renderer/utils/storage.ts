import { Constants } from '../constants';

import type { Language } from '../i18n/types';
import type { AtlassifyState } from '../types';

import { DEFAULT_LANGUAGE } from '../i18n';
import useAccountsStore from '../stores/useAccountsStore';
import useFiltersStore from '../stores/useFiltersStore';
import useSettingsStore from '../stores/useSettingsStore';
import { encryptValue } from './comms';
import { rendererLogError, rendererLogInfo } from './logger';

/**
 * Migrate from Context-based storage to Zustand stores.
 * This function reads the old unified storage format and splits it into separate stores.
 * Tokens are encrypted and stored via electron's safeStorage.
 * Should be called once on app startup.
 */
export async function migrateContextToZustand() {
  const existing = localStorage.getItem(Constants.STORAGE_KEY);

  if (!existing) {
    // No old data to migrate
    return;
  }

  try {
    const parsed = JSON.parse(existing);

    // Skip if already migrated
    if (parsed.migrated) {
      rendererLogInfo(
        'migrateContextToStore',
        `Storage already migrated on ${parsed.migratedAt}`,
      );
      return;
    }

    const { auth, settings } = parsed;

    // Migrate auth to AccountsStore if it exists and store is empty
    if (auth?.accounts && useAccountsStore.getState().accounts.length === 0) {
      // Encrypt tokens before storing
      const accountsWithEncryptedTokens = await Promise.all(
        auth.accounts.map(async (account: { id: string; token: string }) => {
          if (account.token && !account.token.startsWith('encrypted:')) {
            // Encrypt the token using the account ID as context
            const encrypted = await encryptValue(
              `${account.id}:${account.token}`,
            );
            return { ...account, token: encrypted };
          }
          return account;
        }),
      );

      useAccountsStore.setState({ accounts: accountsWithEncryptedTokens });
    }

    // Migrate settings to SettingsStore if they exist
    if (settings) {
      // Get current settings (may have defaults already)
      const currentSettings = useSettingsStore.getState();
      // Only update with values from old storage
      const { updateSetting, reset, ...persistedSettings } = currentSettings;
      useSettingsStore.setState({ ...persistedSettings, ...settings });
    }

    // Mark old storage key as migrated instead of removing it
    localStorage.setItem(
      Constants.STORAGE_KEY,
      JSON.stringify({
        migrated: true,
        migratedAt: new Date().toISOString(),
        version: 2, // Zustand-based storage
      }),
    );

    rendererLogInfo(
      'migrateContextToStore',
      'Successfully migrated from Context storage to Zustand stores with encrypted tokens',
    );
  } catch (error) {
    rendererLogError(
      'migrateContextToStore',
      'Error during storage migration',
      error,
    );
    // Don't throw - let the app continue with defaults
  }
}

export function loadState(): AtlassifyState {
  const existing = localStorage.getItem(Constants.STORAGE_KEY);
  const { auth, settings } = (existing && JSON.parse(existing)) || {};

  return { auth, settings };
}

export async function saveState(atlassifyState: AtlassifyState) {
  const auth = atlassifyState.auth;
  const settings = atlassifyState.settings;
  const settingsString = JSON.stringify({ auth, settings });

  localStorage.setItem(Constants.STORAGE_KEY, settingsString);
}

export function clearState() {
  localStorage.clear();
  useAccountsStore.getState().reset();
  useSettingsStore.getState().reset();
  useFiltersStore.getState().reset();
}

export function loadLanguageLocale(): Language {
  const existing = localStorage.getItem(Constants.LANGUAGE_STORAGE_KEY);
  const language = (existing as Language) || DEFAULT_LANGUAGE;

  return language;
}
