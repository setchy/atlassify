import { defineConfig, type UserConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig(() => {
  const config: UserConfig = {
    resolve: {
      conditions: ['node'],
    },
    build: {
      outDir: '.vite/build',
      rollupOptions: {
        output: {
          format: 'cjs',
          entryFileNames: 'preload.js',
        },
      },
    },
  };

  return config;
});
