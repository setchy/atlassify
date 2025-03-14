import { type FC, useEffect, useRef } from 'react';

import { convertTextToEmojiImgHtml } from '../../utils/emojis';

export interface IEmojiText {
  text: string;
}

export const EmojiText: FC<IEmojiText> = ({ text }) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const updateEmojiText = async () => {
      if (ref.current) {
        const emojiHtml = await convertTextToEmojiImgHtml(text);
        ref.current.innerHTML = emojiHtml;
      }
    };
    updateEmojiText();
  }, [text]);

  return <span ref={ref} />;
};
