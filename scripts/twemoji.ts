import fs from 'node:fs';
import path from 'node:path';

import twemoji from '@discordapp/twemoji';

import { Constants } from '../src/renderer/constants';

import { Errors } from '../src/renderer/utils/errors';

function logForgeProgress(msg: string) {
  // biome-ignore lint/suspicious/noConsole: log packaging progress
  console.log(`  • [forge]: ${msg}`);
}

export async function copyTwemojiAssets() {
  logForgeProgress('Twemoji assets: Copying to renderer/public folder...');

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
  ) as string[];

  for (const filename of ALL_EMOJI_SVG_FILENAMES) {
    const srcPath = path.resolve(
      __dirname,
      '..',
      'node_modules/@discordapp/twemoji/dist/svg',
      filename,
    );
    const destPath = path.resolve(
      __dirname,
      '..',
      'src',
      'renderer',
      'public',
      'images',
      'twemoji',
      filename,
    );

    await fs.promises.mkdir(path.dirname(destPath), { recursive: true });
    await fs.promises.copyFile(srcPath, destPath);
  }

  logForgeProgress(
    `Twemoji assets: Copied ${ALL_EMOJI_SVG_FILENAMES.length} files complete.`,
  );
}
