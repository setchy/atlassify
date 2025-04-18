import { DEFAULT_LANGUAGE } from '../i18n';
import type { Language } from '../i18n/types';
import type { AtlassifyState } from '../types';
import { Constants } from './constants';

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
}

export function loadLanguageLocale(): Language {
  const existing = localStorage.getItem(Constants.LANGUAGE_STORAGE_KEY);
  const language = (existing as Language) || DEFAULT_LANGUAGE;

  return language;
}
