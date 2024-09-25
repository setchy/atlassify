import { B200 } from '@atlaskit/theme/colors';
import type { Config } from 'tailwindcss';

export const colors = {
  sidebar: B200,
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
