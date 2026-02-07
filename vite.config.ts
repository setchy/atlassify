import { fileURLToPath } from 'node:url';

import compiled from '@compiled/vite-plugin';
import twemoji from '@discordapp/twemoji';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import electron from 'vite-plugin-electron/simple';
import { viteStaticCopy } from 'vite-plugin-static-copy';

import { Constants } from './src/renderer/constants';

import { Errors } from './src/renderer/utils/errors';

const ALL_EMOJIS = [
  ...Constants.ALL_READ_EMOJIS,
  ...Errors.BAD_CREDENTIALS.emojis,
  ...Errors.BAD_REQUEST.emojis,
  ...Errors.NETWORK.emojis,
  ...Errors.UNKNOWN.emojis,
];

const extractSvgFilename = (imgHtml: string) =>
  imgHtml
    .match(/src="(.*)"/)?.[1]
    .split('/')
    .pop();

const ALL_EMOJI_SVG_FILENAMES = ALL_EMOJIS.map((emoji) =>
  extractSvgFilename(twemoji.parse(emoji, { folder: 'svg', ext: '.svg' })),
);

export default defineConfig(() => ({
  plugins: [
    checker({
      // typescript: true,
      biome: {
        dev: {
          logLevel: ['error'],
        },
      },
    }),
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
    electron({
      main: {
        entry: fileURLToPath(new URL('src/main/index.ts', import.meta.url)),
        vite: {
          build: {
            outDir: fileURLToPath(new URL('build', import.meta.url)),
            rollupOptions: {
              output: { entryFileNames: 'main.js', format: 'cjs' },
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
        },
      },
      preload: {
        input: fileURLToPath(new URL('src/preload/index.ts', import.meta.url)),
        vite: {
          build: {
            outDir: fileURLToPath(new URL('build', import.meta.url)),
            rollupOptions: { output: { entryFileNames: 'preload.js' } },
          },
          resolve: { conditions: ['node'] },
        },
      },
    }),
    viteStaticCopy({
      targets: [
        ...ALL_EMOJI_SVG_FILENAMES.map((filename) => ({
          src: `../../node_modules/@discordapp/twemoji/dist/svg/${filename}`,
          dest: 'images/twemoji',
        })),
        {
          src: '../../assets',
          dest: '.',
        },
      ],
    }),
  ],
  root: 'src/renderer',
  publicDir: false as const,
  base: './',
  build: { outDir: '../../build', emptyOutDir: true },
}));
