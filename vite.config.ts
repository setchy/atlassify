import path from 'node:path';

import twemoji from '@discordapp/twemoji';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import electron from 'vite-plugin-electron/simple';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// Import constants to get emoji list
const ALL_EMOJIS = [
  '🎉',
  '🎊',
  '🥳',
  '👏',
  '🙌',
  '😎',
  '🏖️',
  '🚀',
  '✨',
  '🏆', // ALL_READ_EMOJIS
  '🧐',
  '😕',
  '🤔',
  '😖',
  '😞',
  '😟',
  '😢',
  '😭',
  '😱',
  '😳', // Various error emojis
];

function extractSvgFilename(imgHtml: string) {
  const srcMatch = /src="(.*)"/.exec(imgHtml);
  const src = srcMatch ? srcMatch[1] : '';
  const filename = src.split('/').pop();
  return filename;
}

const ALL_EMOJI_SVG_FILENAMES = ALL_EMOJIS.map((emoji) => {
  const imgHtml = twemoji.parse(emoji, { folder: 'svg', ext: '.svg' });
  return extractSvgFilename(imgHtml);
});

export default defineConfig(({ mode }) => {
  const rootPath = path.resolve(__dirname);

  return {
    plugins: [
      react({
        babel: {
          plugins: ['@compiled/babel-plugin'],
        },
      }),
      electron({
        main: {
          entry: path.join(rootPath, 'src/main/index.ts'),
          vite: {
            build: {
              outDir: path.join(rootPath, 'build'),
              rollupOptions: {
                output: {
                  entryFileNames: 'main.js',
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
          },
        },
        preload: {
          input: path.join(rootPath, 'src/preload/index.ts'),
          vite: {
            build: {
              outDir: path.join(rootPath, 'build'),
              rollupOptions: {
                output: {
                  entryFileNames: 'preload.js',
                },
              },
            },
            // Preload scripts don't need Node.js polyfills
            // as they run in a sandboxed context
            resolve: {
              conditions: ['node'],
            },
          },
        },
        renderer: mode === 'development' ? undefined : {},
      }),
      viteStaticCopy({
        targets: ALL_EMOJI_SVG_FILENAMES.map((filename) => ({
          src: path.resolve(
            __dirname,
            `node_modules/@discordapp/twemoji/dist/svg/${filename}`,
          ),
          dest: 'images/twemoji',
        })),
      }),
    ],
    root: 'src/renderer',
    publicDir: '../../public',
    base: './',
    build: {
      outDir: '../../build',
      emptyOutDir: true,
    },
    resolve: {
      extensions: ['.js', '.ts', '.tsx', '.json'],
    },
    server: {
      port: 5173,
    },
  };
});
