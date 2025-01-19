import TailwindCSSTypography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';
import TailwindCSSAnimate from 'tailwindcss-animate';
import colors from 'tailwindcss/colors';

const config: Config = {
  darkMode: ['class', '[data-kb-theme="dark"]'],
  content: ['./src/**/*.{astro,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        atlassify: {
          docs: {
            navbar: '#2684FF',
            footer: colors.gray[800],
            section: {
              light: colors.gray[50],
              dark: colors.gray[800],
            },
            hero: colors.gray[100],
            icon: {
              hover: colors.gray[200],
            },
            repo: {
              hover: colors.blue[300],
            },
            link: colors.white,
            download: {
              link: colors.black,
              rest: colors.green[700],
              hover: colors.green[800],
            },
            button: {
              rest: colors.blue[600],
              hover: colors.blue[700],
            },
          },
        },
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--kb-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--kb-accordion-content-height)' },
          to: { height: '0' },
        },
        'content-show': {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'content-hide': {
          from: { opacity: '1', transform: 'scale(1)' },
          to: { opacity: '0', transform: 'scale(0.96)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'content-show': 'content-show 0.2s ease-out',
        'content-hide': 'content-hide 0.2s ease-out',
      },
    },
  },
  plugins: [TailwindCSSAnimate, TailwindCSSTypography],
};

export default config;
