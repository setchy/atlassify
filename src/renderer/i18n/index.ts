import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import deTranslation from "./locales/de.json";
import enTranslation from "./locales/en.json";
import esTranslation from "./locales/es.json";
import frTranslation from "./locales/fr.json";

const resources = {
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
	// detect user language
	.use(LanguageDetector)
	// pass the i18n instance to react-i18next
	.use(initReactI18next)
	// init i18next
	.init({
		resources,
		fallbackLng: "de",
		debug: process.env.NODE_ENV === "development",
		interpolation: {
			escapeValue: false, // not needed for react as it escapes by default
		},
		detection: {
			// order and from where user language should be detected
			order: ["localStorage", "navigator"],
			// keys or params to lookup language from
			lookupLocalStorage: "atlassify_language",
			// cache user language
			caches: ["localStorage"],
		},
	});

export default i18n;
