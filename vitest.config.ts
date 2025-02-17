import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/renderer/__helpers__/vitest.setup.ts'],
    globals: true,
    coverage: {
      reporter: ['lcov', 'text', 'html'],
      include: ['src'],
    },
    outputFile: 'coverage/sonar-report.xml',
  },
});
