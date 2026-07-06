import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';
import TailwindCSSMotion from 'tailwindcss-motion';

const config: Config = {
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
    },
  },
  plugins: [TailwindCSSMotion],
};

export default config;
