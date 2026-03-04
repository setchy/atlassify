import { fileURLToPath } from 'node:url';

import compiled from '@compiled/vite-plugin';
import twemoji from '@discordapp/twemoji';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import type { Plugin } from 'vite';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import electron from 'vite-plugin-electron/simple';
import { viteStaticCopy } from 'vite-plugin-static-copy';

import { Constants } from './src/renderer/constants';

const ALL_EMOJIS = (function flatten(obj: object): string[] {
  return Object.values(obj).flatMap((v) =>
    Array.isArray(v) ? v : flatten(v as object),
  );
})(Constants.EMOJIS);

const extractSvgFilename = (imgHtml: string) =>
  imgHtml
    .match(/src="(.*)"/)?.[1]
    .split('/')
    .pop();

const ALL_EMOJI_SVG_FILENAMES = ALL_EMOJIS.map((emoji) =>
  extractSvgFilename(twemoji.parse(emoji, { folder: 'svg', ext: '.svg' })),
);

/**
 * Vite plugin that injects React DevTools connection script in dev mode only.
 * This script connects the renderer process to the standalone react-devtools instance.
 */
const reactDevToolsPlugin = (): Plugin => ({
  name: 'react-devtools',
  apply: 'serve', // Only apply in dev mode (vite dev)
  transformIndexHtml(html) {
    // Inject devtools connection script and update CSP to allow localhost:8097
    return html
      .replace(
        '<meta http-equiv="Content-Security-Policy" content="script-src \'self\';',
        '<meta http-equiv="Content-Security-Policy" content="script-src \'self\' http://localhost:8097;',
      )
      .replace(
        '</head>',
        '  <script src="http://localhost:8097"></script>\n  </head>',
      );
  },
});

export default defineConfig(({ command }) => {
  const isBuild = command === 'build';

  return {
    plugins: [
      // only run the checker plugin in dev (not during `vite build`)
      ...(isBuild
        ? []
        : [
            checker({
              typescript: true,
              biome: { dev: { logLevel: ['error'] } },
            }),
          ]),
      reactDevToolsPlugin(),
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
      tailwindcss(),
      electron({
        main: {
          entry: fileURLToPath(new URL('src/main/index.ts', import.meta.url)),
          vite: {
            // Define build-time replacements for the main process bundle.
            // During CI builds `process.env.APTABASE_KEY` will be injected via the environment.
            define: isBuild
              ? {
                  'process.env.APTABASE_KEY': JSON.stringify(
                    process.env.APTABASE_KEY ?? '',
                  ),
                }
              : {},
            build: {
              outDir: fileURLToPath(new URL('build', import.meta.url)),
              rollupOptions: {
                output: { entryFileNames: 'main.js' },
                external: [
                  'electron',
                  // TODO - how many of these are truly needed?
                  'electron-log',
                  'electron-updater',
                  'menubar',
                  '@aptabase/electron',
                ],
              },
            },
          },
        },
        preload: {
          input: fileURLToPath(
            new URL('src/preload/index.ts', import.meta.url),
          ),
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
            dest: 'assets/images/twemoji',
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
    build: {
      outDir: fileURLToPath(new URL('build', import.meta.url)),
      emptyOutDir: true,
    },
  };
});
