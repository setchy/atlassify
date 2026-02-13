import { B200, DN40, DN50, N10, R300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

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
              background: token('color.background.accent.gray.subtler'),
              outline: token('color.text.subtle'),
            },
            selected: {
              background: token('color.background.accent.blue.subtler'),
              outline: token('color.text.selected'),
            },
          },
        },
      },
    },
  },
  plugins: [
    plugin(({ addBase }) => {
      addBase({
        ':root': {
          '--atlassify-background-sidebar': B200,
          '--atlassify-background-notifications': N10,

          '--atlassify-scrollbar-track': token(
            'color.background.accent.blue.subtlest',
          ),
          '--atlassify-scrollbar-thumb': token(
            'color.background.accent.blue.subtler',
          ),
          '--atlassify-scrollbar-thumb-hover': token(
            'color.background.accent.blue.subtler.hovered',
          ),
        },
        '.dark': {
          '--atlassify-background-sidebar': DN50,
          '--atlassify-background-notifications': DN40,

          '--atlassify-scrollbar-track': token(
            'color.background.accent.gray.subtlest',
          ),
          '--atlassify-scrollbar-thumb': token(
            'color.background.accent.gray.subtler',
          ),
          '--atlassify-scrollbar-thumb-hover': token(
            'color.background.accent.gray.subtler.hovered',
          ),
        },
      });
    }),
  ],
};

export default config;
