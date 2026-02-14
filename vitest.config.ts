import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    pool: 'threads',
    setupFiles: ['./src/renderer/__helpers__/vitest.setup.ts'],
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
        log.includes('i18next is maintained with support from locize.com')
      ) {
        return false;
      }
    },
    coverage: {
      enabled: false,
      provider: 'v8',
      reportsDirectory: './coverage',
      cleanOnRerun: true,
      reporter: ['html', 'lcovonly'],
      include: ['src/**/*'],
      exclude: [
        '**/__snapshots__/**',
        '**/graphql/generated/**',
        '**/*.graphql',
        '**/*.html',
        '.DS_Store',
      ],
    },
    exclude: [
      '**/node_modules/**',
      '**/build/**',
      '**/dist/**',
      '**/.vite/**',
      '**/out/**',
      '**/.{idea,git,cache,output,temp}/**',
    ],
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
        },
      },
      {
        // TODO - Opportunity in future to move some of the renderer util tests to node environment
        test: {
          name: 'node [main, shared]',
          environment: 'node',
          include: [
            'src/shared/**/*.test.{ts,tsx}',
            'src/main/**/*.test.{ts,tsx}',
          ],
          // setupFiles: ['./src/shared/__helpers__/vitest.setup.node.ts'],
          setupFiles: [],
          globals: true,
        },
      },
    ],
  },
});
