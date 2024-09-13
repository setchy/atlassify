/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.js', './src/**/*.ts', './src/**/*.tsx'],
  darkMode: 'class',
  theme: {
    extend: {
      fontSize: {
        xxs: '0.625rem', // 10px
      },
      colors: {
        // TODO - Update to use color palette - https://atlassian.design/foundations/color-new/color-palette-new/
        gray: {
          sidebar: '#24292e',
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
