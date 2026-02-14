import twemoji, { type TwemojiOptions } from '@discordapp/twemoji';

import { Constants } from '../constants';

const EMOJI_FORMAT = 'svg';

export async function convertTextToEmojiImgHtml(text: string): Promise<string> {
  return twemoji.parse(text, {
    folder: EMOJI_FORMAT,
    callback: (icon: string, _options: TwemojiOptions) => {
      return `${Constants.TWEMOJI_IMAGE_PATH}/${icon}.${EMOJI_FORMAT}`;
    },
  });
}
