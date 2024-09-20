import type { Config } from 'tailwindcss';

export const colors = {
  sidebar: '#388BFF',
};

const config: Config = {
  content: ['./src/**/*.js', './src/**/*.ts', './src/**/*.tsx'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: colors,
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};

export default config;
