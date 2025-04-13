/**
 * The different types of allowed languages.
 */
export type Language = 'de' | 'en' | 'es' | 'fr';

const LANGUAGE_LABELS: Record<Language, string> = {
  de: 'Deutsch',
  en: 'English',
  es: 'Español',
  fr: 'Français',
};

interface LanguageOption {
  label: string;
  value: Language;
}

export const LANGUAGES: LanguageOption[] = Object.entries(LANGUAGE_LABELS).map(
  ([value, label]) => ({ label, value: value as Language }),
);
