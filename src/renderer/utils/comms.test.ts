import { vi } from 'vitest';

import { mockSettings } from '../__mocks__/state-mocks';

import { type Link, OpenPreference } from '../types';

import {
  decryptValue,
  encryptValue,
  getAppVersion,
  hideWindow,
  openExternalLink,
  quitApp,
  setAutoLaunch,
  setKeyboardShortcut,
  setUseAlternateIdleIcon,
  showWindow,
  updateTrayColor,
  updateTrayTitle,
} from './comms';
import * as storage from './storage';

describe('renderer/utils/comms.ts', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('openExternalLink', () => {
    it('should open an external link', () => {
      vi.spyOn(storage, 'loadState').mockReturnValue({
        settings: { ...mockSettings, openLinks: OpenPreference.BACKGROUND },
      });

      openExternalLink('https://atlassify.io/' as Link);

      expect(window.atlassify.openExternalLink).toHaveBeenCalledTimes(1);
      expect(window.atlassify.openExternalLink).toHaveBeenCalledWith(
        'https://atlassify.io/',
        false,
      );
    });

    it('should open in foreground when preference set to FOREGROUND', () => {
      vi.spyOn(storage, 'loadState').mockReturnValue({
        settings: { ...mockSettings, openLinks: OpenPreference.FOREGROUND },
      });

      openExternalLink('https://atlassify.io/' as Link);

      expect(window.atlassify.openExternalLink).toHaveBeenCalledWith(
        'https://atlassify.io/',
        true,
      );
    });

    it('should use default open preference if user settings not found', () => {
      vi.spyOn(storage, 'loadState').mockReturnValue({ settings: null });

      openExternalLink('https://atlassify.io/' as Link);

      expect(window.atlassify.openExternalLink).toHaveBeenCalledTimes(1);
      expect(window.atlassify.openExternalLink).toHaveBeenCalledWith(
        'https://atlassify.io/',
        true,
      );
    });

    it('should ignore opening external local links file:///', () => {
      openExternalLink('file:///Applications/SomeApp.app' as Link);

      expect(window.atlassify.openExternalLink).not.toHaveBeenCalled();
    });

    it('should ignore non-https links (http)', () => {
      openExternalLink('http://example.com' as Link);
      expect(window.atlassify.openExternalLink).not.toHaveBeenCalled();
    });
  });

  describe('app/version & crypto helpers', () => {
    it('gets app version', async () => {
      const version = await getAppVersion();
      expect(window.atlassify.app.version).toHaveBeenCalledTimes(1);
      expect(version).toBe('v0.0.1');
    });

    it('encrypts value', async () => {
      const value = await encryptValue('plain');

      expect(window.atlassify.encryptValue).toHaveBeenCalledTimes(1);
      expect(window.atlassify.encryptValue).toHaveBeenCalledWith('plain');
      expect(value).toBe('encrypted');
    });

    it('decrypts value', async () => {
      const value = await decryptValue('encrypted');

      expect(window.atlassify.decryptValue).toHaveBeenCalledTimes(1);
      expect(window.atlassify.decryptValue).toHaveBeenCalledWith('encrypted');
      expect(value).toBe('decrypted');
    });
  });

  describe('window / app actions', () => {
    it('quits app', () => {
      quitApp();
      expect(window.atlassify.app.quit).toHaveBeenCalledTimes(1);
    });

    it('shows window', () => {
      showWindow();
      expect(window.atlassify.app.show).toHaveBeenCalledTimes(1);
    });

    it('hides window', () => {
      hideWindow();
      expect(window.atlassify.app.hide).toHaveBeenCalledTimes(1);
    });
  });

  describe('settings toggles', () => {
    it('sets auto launch', () => {
      setAutoLaunch(true);

      expect(window.atlassify.setAutoLaunch).toHaveBeenCalledTimes(1);
      expect(window.atlassify.setAutoLaunch).toHaveBeenCalledWith(true);
    });

    it('sets alternate idle icon', () => {
      setUseAlternateIdleIcon(false);

      expect(window.atlassify.tray.useAlternateIdleIcon).toHaveBeenCalledTimes(
        1,
      );
      expect(window.atlassify.tray.useAlternateIdleIcon).toHaveBeenCalledWith(
        false,
      );
    });

    it('sets keyboard shortcut', () => {
      setKeyboardShortcut(true);

      expect(window.atlassify.setKeyboardShortcut).toHaveBeenCalledTimes(1);
      expect(window.atlassify.setKeyboardShortcut).toHaveBeenCalledWith(true);
    });
  });

  describe('tray helpers', () => {
    it('updates tray icon color with count', () => {
      updateTrayColor(5);

      expect(window.atlassify.tray.updateColor).toHaveBeenCalledTimes(1);
      expect(window.atlassify.tray.updateColor).toHaveBeenCalledWith(5);
    });

    it('updates tray title with provided value', () => {
      updateTrayTitle('Atlassify');

      expect(window.atlassify.tray.updateTitle).toHaveBeenCalledTimes(1);
      expect(window.atlassify.tray.updateTitle).toHaveBeenCalledWith(
        'Atlassify',
      );
    });
  });
});
