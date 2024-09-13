import type { AtlasifyState } from '../types';
import { Constants } from './constants';

export function loadState(): AtlasifyState {
  const existing = localStorage.getItem(Constants.STORAGE_KEY);
  const { auth, settings } = (existing && JSON.parse(existing)) || {};
  return { auth, settings };
}

export function saveState(atlasifyState: AtlasifyState) {
  const auth = atlasifyState.auth;
  const settings = atlasifyState.settings;
  const settingsString = JSON.stringify({ auth, settings });
  localStorage.setItem(Constants.STORAGE_KEY, settingsString);
}

export function clearState() {
  localStorage.clear();
}
