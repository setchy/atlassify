/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.js', './src/**/*.ts', './src/**/*.tsx'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sidebar: '#388BFF',

        // TODO - Update to use color palette - https://atlassian.design/foundations/color-new/color-palette-new/
        gray: {
          dark: '#161b22',
          darker: '#090E15',
          darkest: '#000209',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
