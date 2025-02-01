import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';

import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  vite: {
    build: {
            cssCodeSplit: false, // Ensures all CSS is bundled together
    },
    plugins: [tailwindcss()],
  },
  integrations: [icon()],
});
