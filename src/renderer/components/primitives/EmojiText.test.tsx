import { act, render } from '@testing-library/react';

import { EmojiText, type EmojiTextProps } from './EmojiText';

describe('renderer/components/primitives/Emoji.tsx', () => {
  it('should render', async () => {
    const props: EmojiTextProps = {
      text: '🍺',
    };

    let tree: ReturnType<typeof render> | null = null;

    await act(async () => {
      tree = render(<EmojiText {...props} />);
    });

    expect(tree).toMatchSnapshot();
  });
});
