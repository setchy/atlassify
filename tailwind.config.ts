import { B200, DN40, DN50, N10, R300 } from '@atlaskit/theme/colors';

import type { Config } from 'tailwindcss';

const sidebarWidth = '3rem'; // 48px

const config: Config = {
  content: ['./src/**/*.ts', './src/**/*.tsx'],
  darkMode: 'class',
  theme: {
    extend: {
      spacing: {
        sidebar: sidebarWidth,
      },
      width: {
        sidebar: sidebarWidth,
      },
      colors: {
        atlassify: {
          sidebar: 'var(--atlassify-background-sidebar)',
          notifications: 'var(--atlassify-background-notifications)',
          attention: R300,
          heroicon: {
            neutral: {
              background: 'var(--ds-background-accent-gray-subtler)',
              outline: 'var(--ds-text-subtle)',
            },
            selected: {
              background: 'var(--ds-background-accent-blue-subtler)',
              outline: 'var(--ds-text-selected)',
            },
          },
        },
      },
    },
  },
  plugins: [
    ({ addBase }) => {
      addBase({
        ':root': {
          '--atlassify-background-sidebar': B200,
          '--atlassify-background-notifications': N10,

          '--atlassify-scrollbar-track':
            'var(--ds-background-accent-blue-subtlest)',
          '--atlassify-scrollbar-thumb':
            'var(--ds-background-accent-blue-subtler)',
          '--atlassify-scrollbar-thumb-hover':
            'var(--ds-background-accent-blue-subtler-hovered)',
        },
        '.dark': {
          '--atlassify-background-sidebar': DN50,
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
