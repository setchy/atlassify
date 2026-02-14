import { type FC, useEffect, useRef } from 'react';

import { convertTextToEmojiImgHtml } from '../../utils/emojis';

export interface EmojiTextProps {
  text: string;
}

// FIXME - this is loading the wrong path
export const EmojiText: FC<EmojiTextProps> = ({ text }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const updateEmojiText = async () => {
      const emojiHtml = await convertTextToEmojiImgHtml(text);

      if (!mountedRef.current) {
        return;
      }

      if (ref.current) {
        ref.current.innerHTML = emojiHtml;
      }
    };

    updateEmojiText();

    return () => {
      mountedRef.current = false;
    };
  }, [text]);

  return <span ref={ref} />;
};
