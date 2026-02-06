import { fileURLToPath } from 'node:url';

import compiled from '@compiled/vite-plugin';
import twemoji from '@discordapp/twemoji';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
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
    compiled(),
    react(),
    electron({
      main: {
        entry: fileURLToPath(new URL('src/main/index.ts', import.meta.url)),
        vite: {
          build: {
            outDir: 'build',
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
            outDir: 'build',
            rollupOptions: { output: { entryFileNames: 'preload.js' } },
          },
          resolve: { conditions: ['node'] },
        },
      },
    }),
    viteStaticCopy({
      targets: [
        ...ALL_EMOJI_SVG_FILENAMES.map((filename) => ({
          src: fileURLToPath(
            new URL(
              `node_modules/@discordapp/twemoji/dist/svg/${filename}`,
              import.meta.url,
            ),
          ),
          dest: 'build/images/twemoji',
        })),
        {
          src: fileURLToPath(new URL('assets', import.meta.url)),
          dest: 'build',
        },
      ],
    }),
  ],
  root: 'src/renderer',
  publicDir: false as const,
  base: './',
  build: { outDir: '../../build', emptyOutDir: true },
}));
