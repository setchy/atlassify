import { B200, DN40, DN50, N10, R300 } from '@atlaskit/theme/colors';

import type { Config } from 'tailwindcss';

export const colors = {
  sidebar: {
    light: B200,
    dark: DN50,
  },
};

const config: Config = {
  content: ['./src/**/*.js', './src/**/*.ts', './src/**/*.tsx'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        atlassify: {
          sidebar: 'var(--color-atlassify-sidebar)',
          notifications: 'var(--color-atlassify-notifications)',
          attention: R300,
        },
      },
    },
  },
  plugins: [
    ({ addBase }) => {
      addBase({
        ':root': {
          '--color-atlassify-sidebar': colors.sidebar.light,
          '--color-atlassify-notifications': N10,
        },
        '.dark': {
          '--color-atlassify-sidebar': colors.sidebar.dark,
          '--color-atlassify-notifications': DN40,
        },
      });
    },
  ],
};

export default config;
