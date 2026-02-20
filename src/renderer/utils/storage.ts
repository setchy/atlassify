import { Constants } from '../constants';

import { useAccountsStore, useSettingsStore } from '../stores';

import type { Language } from '../i18n/types';

import { DEFAULT_LANGUAGE } from '../i18n';
import { rendererLogError, rendererLogInfo } from './logger';

/**
 * Migrate from Context-based storage to Zustand stores.
 * This function reads the old unified storage format and splits it into separate stores.
 * Should be called once on app startup.
 *
 * In v2.16.7 and earlier, settings contained both app settings AND filter values.
 * This migration splits them into separate stores.
 *
 * TODO: Remove this migration function in a future major release (v3.0.0+)
 * once all users have migrated from the old Context-based storage format.
 * Migration was introduced in v2.17.0.
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
      useAccountsStore.setState({ accounts: auth.accounts });
    }

    // Migrate settings to SettingsStore
    if (settings) {
      // Migrate app settings to SettingsStore (Zustand will ignore unknown properties)
      useSettingsStore.setState({ ...settings });
    }

    // Mark old storage key as migrated instead of removing it
    localStorage.setItem(
      Constants.STORAGE_KEY,
      JSON.stringify({
        migrated: true,
        migratedAt: new Date().toISOString(),
      }),
    );

    rendererLogInfo(
      'migrateContextToStore',
      'Successfully migrated from Context storage to Zustand stores',
    );
  } catch (err) {
    rendererLogError(
      'migrateContextToStore',
      'Error during storage migration',
      err,
    );
    // Don't throw - let the app continue with defaults
  }
}

export function loadLanguageLocale(): Language {
  const existing = localStorage.getItem(Constants.LANGUAGE_STORAGE_KEY);
  const language = (existing as Language) || DEFAULT_LANGUAGE;

  return language;
}
