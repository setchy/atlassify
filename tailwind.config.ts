import { B200, N800 } from '@atlaskit/theme/colors';

import type { Config } from 'tailwindcss';

export const colors = {
  'sidebar-light': B200,
  'sidebar-dark': N800,
  'notification-light': 'gray-100',
  'notification-dark': 'gray-700',
  'accounts-light': 'gray-100',
  'accounts-dark': 'gray-700',
};

const config: Config = {
  content: ['./src/**/*.js', './src/**/*.ts', './src/**/*.tsx'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: colors,
    },
  },
  plugins: [],
};

export default config;
