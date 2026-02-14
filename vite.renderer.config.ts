import compiled from '@compiled/vite-plugin';
import react from '@vitejs/plugin-react-swc';
import { defineConfig, type UserConfig } from 'vite';
import checker from 'vite-plugin-checker';

// https://vitejs.dev/config
export default defineConfig(({ command }) => {
  const isBuild = command === 'build';

  const config: UserConfig = {
    plugins: [
      ...(isBuild
        ? []
        : [
            checker({
              typescript: true,
              biome: { dev: { logLevel: ['error'] } },
            }),
          ]),
      compiled(),
      react({
        plugins: [
          [
            '@swc-contrib/plugin-graphql-codegen-client-preset',
            {
              artifactDirectory: './src/renderer/utils/api/graphql/generated',
              gqlTagName: 'graphql',
            },
          ],
        ],
      }),
    ],
    root: 'src/renderer',
    base: './',
    build: {
      outDir: '../../.vite/build/renderer',
      emptyOutDir: true,
    },
  };

  return config;
});
