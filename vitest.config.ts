import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    pool: 'threads',
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
        log.includes('i18next is maintained with support from Locize')
      ) {
        return false;
      }
    },
    coverage: {
      enabled: false,
      reportOnFailure: true,
      reporter: ['html', 'lcovonly'],
      include: ['src/**/*'],
      exclude: ['**/*.html', '**/*.graphql', '**/graphql/generated/**'],
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
