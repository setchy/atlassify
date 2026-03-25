import { defineConfig } from 'i18next-cli';

export default defineConfig({
  locales: ['en', 'de', 'es', 'fr'],
  extract: {
    input: ['src/renderer/**/*.{ts,tsx}'],
    output: 'src/renderer/i18n/locales/{{language}}.json',

    defaultNS: false,
    primaryLanguage: 'en',

    sort: true,
    removeUnusedKeys: true,
    indentation: 2,
    disablePlurals: true,
  },
  lint: {
    ignore: ['**/*.test.{ts,tsx}'],
  },

  types: {
    input: ['src/renderer/i18n/locales/en.json'],
    output: 'src/@types/i18next.d.ts',
    resourcesFile: 'src/@types/resources.d.ts',
  },
});
