import { Constants } from '../constants';

import { DEFAULT_LANGUAGE } from './types';

import i18n, { loadLanguageLocale, setLanguage } from './loader';

describe('renderer/i18n/loader.ts', () => {
  beforeEach(() => {
    localStorage.removeItem(Constants.STORAGE.LANGUAGE);
  });

  describe('loadLanguageLocale', () => {
    it('returns the stored language when it is supported', () => {
      localStorage.setItem(Constants.STORAGE.LANGUAGE, 'de');

      expect(loadLanguageLocale()).toBe('de');
    });

    it('ignores a stored language that is not supported', () => {
      localStorage.setItem(Constants.STORAGE.LANGUAGE, 'de-AT');

      expect(loadLanguageLocale()).not.toBe('de-AT');
    });

    it('falls back to the resolved language when nothing is stored', () => {
      expect(loadLanguageLocale()).toBe(
        i18n.resolvedLanguage ?? DEFAULT_LANGUAGE,
      );
    });
  });

  describe('setLanguage', () => {
    afterEach(async () => {
      await i18n.changeLanguage(DEFAULT_LANGUAGE);
    });

    it('persists an explicit choice and switches the active language', async () => {
      await setLanguage('fr');

      expect(localStorage.getItem(Constants.STORAGE.LANGUAGE)).toBe('fr');
      expect(i18n.language).toBe('fr');
    });
  });

  describe('detection', () => {
    it('does not persist the detected language', () => {
      i18n.services.languageDetector.cacheUserLanguage?.('de');

      expect(localStorage.getItem(Constants.STORAGE.LANGUAGE)).toBeNull();
    });

    it('resolves regional locales to their base language', () => {
      expect(i18n.options.load).toBe('languageOnly');
      expect(i18n.options.supportedLngs).toEqual(
        expect.arrayContaining(['de', 'en', 'es', 'fr']),
      );
    });
  });
});
