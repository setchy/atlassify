import { defineConfig, type UserConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config
export default defineConfig(({ command }) => {
  const isBuild = command === 'build';

  const config: UserConfig = {
    // Define build-time replacements for the main process bundle.
    // During CI builds `process.env.APTABASE_KEY` will be injected via the environment.
    // In dev, don't replace it - let dotenv load it at runtime
    define: isBuild
      ? {
          'process.env.APTABASE_KEY': JSON.stringify(
            process.env.APTABASE_KEY ?? '',
          ),
        }
      : {},
    build: {
      // Don't minify in dev to preserve runtime process.env access
      minify: isBuild,
      rollupOptions: {
        output: {
          format: 'cjs',
        },
        external: [
          'electron',
          'electron-log',
          'electron-updater',
          'menubar',
          '@aptabase/electron',
          'dotenv',
        ],
      },
    },
    plugins: [
      // Copy assets to main build output
      viteStaticCopy({
        targets: [
          {
            src: 'assets',
            dest: '.',
          },
        ],
      }),
    ],
  };

  return config;
});
