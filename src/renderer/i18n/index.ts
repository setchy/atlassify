import { initReactI18next } from 'react-i18next';

import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { Constants } from '../constants';

import type { Language } from './types';

// Locales
import deTranslation from './locales/de.json';
import enTranslation from './locales/en.json';
import esTranslation from './locales/es.json';
import frTranslation from './locales/fr.json';

export const DEFAULT_LANGUAGE: Language = 'en';

// biome-ignore lint/suspicious/noExplicitAny: no need to explicitly check translation keys
const resources: Record<Language, { translation: Record<string, any> }> = {
  de: {
    translation: deTranslation,
  },
  en: {
    translation: enTranslation,
  },
  es: {
    translation: esTranslation,
  },
  fr: {
    translation: frTranslation,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: DEFAULT_LANGUAGE,
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    detection: {
      // order and from where user language should be detected
      order: ['localStorage', 'navigator'],
      // keys or params to lookup language from
      lookupLocalStorage: Constants.LANGUAGE_STORAGE_KEY,
      // cache user language
      caches: ['localStorage'],
    },
  });

export default i18n;
