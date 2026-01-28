import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/renderer/__helpers__/vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['node_modules', 'build', 'dist'],
    alias: {
      // Atlassian Design System - @atlaskit Compiled CSS in JS
      '\\.compiled.css$': 'identity-obj-proxy',
      '^axios$': require.resolve('axios'),
    },
    deps: {
      inline: [/@atlaskit/, /@testing-library/, /identity-obj-proxy/],
    },
  },
});
