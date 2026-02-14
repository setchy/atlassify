import compiled from '@compiled/vite-plugin';
import twemoji from '@discordapp/twemoji';
import react from '@vitejs/plugin-react-swc';
import { defineConfig, type UserConfig } from 'vite';
import checker from 'vite-plugin-checker';
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

// https://vitejs.dev/config
export default defineConfig(({ command }) => {
  const isBuild = command === 'build';

  const config: UserConfig = {
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
    publicDir: false,
    base: './',
  };

  return config;
});
