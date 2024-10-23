import { B200, DN40, DN50, N10 } from '@atlaskit/theme/colors';

import type { Config } from 'tailwindcss';

export const colors = {
  sidebar: {
    light: B200,
    dark: DN50,
  },
  notifications: {
    light: N10,
    dark: DN40,
  },
  accounts: {
    light: N10,
    dark: DN40,
  },
};

const config: Config = {
  content: ['./src/**/*.js', './src/**/*.ts', './src/**/*.tsx'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sidebar: colors.sidebar,
        notifications: colors.notifications,
        accounts: colors.accounts,
      },
    },
  },
  plugins: [],
};

export default config;
