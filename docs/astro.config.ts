import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';

import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [icon()],
});
