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
          sidebar: 'var(--atlassify-background-sidebar)',
          notifications: 'var(--atlassify-background-notifications)',
          attention: R300,
        },
      },
    },
  },
  plugins: [
    ({ addBase }) => {
      addBase({
        ':root': {
          '--atlassify-background-sidebar': colors.sidebar.light,
          '--atlassify-background-notifications': N10,

          '--atlassify-scrollbar-track':
            'var(--ds-background-accent-blue-subtlest)',
          '--atlassify-scrollbar-thumb':
            'var(--ds-background-accent-blue-subtler)',
          '--atlassify-scrollbar-thumb-hover':
            'var(--ds-background-accent-blue-subtler-hovered)',
        },
        '.dark': {
          '--atlassify-background-sidebar': colors.sidebar.dark,
          '--atlassify-background-notifications': DN40,

          '--atlassify-scrollbar-track':
            'var(--ds-background-accent-gray-subtlest)',
          '--atlassify-scrollbar-thumb':
            'var(--ds-background-accent-gray-subtler)',
          '--atlassify-scrollbar-thumb-hover':
            'var(--ds-background-accent-gray-subtler-hovered)',
        },
      });
    },
  ],
};

export default config;
