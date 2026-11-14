import tokensBabelPlugin from '@atlaskit/tokens/babel-plugin';

import compiled from '@compiled/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// Workaround for @compiled/vite-plugin@2.0.4 on Vite 8: the plugin's dev CSS
// virtual module can be requested in its client-encoded form
// (`/@id/__x00__virtual:@compiled/vite-plugin/local-css:…`), which the plugin's
// own resolveId does not match, so the module fails to load ("Cannot find
// module"). Decode it back to the resolved `\0`-prefixed id so the plugin's
// load() hook runs.
const compiledDevCssCompat = {
  name: 'compiled-dev-css-compat',
  enforce: 'pre' as const,
  resolveId(source: string) {
    const clientPrefix = '/@id/__x00__';
    if (source.startsWith(`${clientPrefix}virtual:@compiled/vite-plugin/`)) {
      return `\0${source.slice(clientPrefix.length)}`;
    }
    return null;
  },
};

export default defineConfig({
  // pre-compile token() calls to literal CSS var strings so cssMap() can statically evaluate them
  plugins: [
    compiledDevCssCompat,
    compiled({ transformerBabelPlugins: [tokensBabelPlugin] }),
    react(),
  ],
  test: {
    globals: true,
    // vmThreads' node:vm ESM/CJS interop breaks packages like react-router that ship
    // an .mjs file inside a CommonJS package
    pool: 'threads',
    clearMocks: true,
    onConsoleLog(log, type) {
      // suppress noisy Atlaskit feature-gate/platform-feature-flags errors
      if (
        type === 'stderr' &&
        typeof log === 'string' &&
        log.includes('Client must be initialized before using this method')
      ) {
        return false;
      }

      // suppress noisy i18next logs
      if (
        type === 'stdout' &&
        typeof log === 'string' &&
        log.includes('Locize')
      ) {
        return false;
      }
    },
    experimental: {
      importDurations: {
        print: true,
      },
    },
    coverage: {
      enabled: false,
      reportOnFailure: true,
      reporter: ['html', 'lcovonly'],
      include: ['src/**/*'],
      exclude: [
        '**/*.html',
        '**/*.graphql',
        '**/graphql/generated/**',
        '**/.DS_Store',
      ],
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'happy-dom [preload, renderer]',
          environment: 'happy-dom',
          include: [
            'src/preload/**/*.test.{ts,tsx}',
            'src/renderer/**/*.test.{ts,tsx}',
          ],
          setupFiles: ['./src/renderer/__helpers__/vitest.setup.ts'],
        },
      },
      {
        // TODO - Opportunity in future to move some of the renderer util tests to node environment
        extends: true,
        test: {
          name: 'node [main, shared]',
          environment: 'node',
          include: [
            'src/shared/**/*.test.{ts,tsx}',
            'src/main/**/*.test.{ts,tsx}',
          ],
        },
      },
    ],
  },
});
