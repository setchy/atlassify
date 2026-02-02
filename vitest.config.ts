import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/renderer/__helpers__/vitest.setup.ts'],
    coverage: {
      enabled: false,
      include: ['src/**/*'],
      exclude: ['**/__snapshots__/**'],
    },
    exclude: [
      '**/node_modules/**',
      '**/build/**',
      '**/dist/**',
      '**/.{idea,git,cache,output,temp}/**',
    ],
  },
  resolve: {
    alias: {
      // Force CommonJS build for http adapter to be available.
      // via https://github.com/axios/axios/issues/5101#issuecomment-1276572468
      axios: require.resolve('axios'),

      // Atlassian Design System - @atlaskit Compiled CSS in JS - https://compiledcssinjs.com/
      '\\.compiled.css$': 'identity-obj-proxy',
    },
  },
});
