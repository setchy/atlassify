/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.js', './src/**/*.ts', './src/**/*.tsx'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sidebar: '#388BFF',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
