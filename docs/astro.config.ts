import { defineConfig } from 'astro/config';
import icon from 'astro-icon';

import tailwindcss from '@tailwindcss/vite';

import { siteMetadata } from './src/constants';

// https://astro.build/config
export default defineConfig({
  site: siteMetadata.url,
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [icon()],
});
