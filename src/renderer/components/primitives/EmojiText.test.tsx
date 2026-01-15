import { act } from '@testing-library/react';

import { renderWithAppContext } from '../../__helpers__/test-utils';

import { EmojiText, type EmojiTextProps } from './EmojiText';

describe('renderer/components/primitives/Emoji.tsx', () => {
  it('should render', async () => {
    const props: EmojiTextProps = {
      text: '🍺',
    };

    let tree: ReturnType<typeof renderWithAppContext> | null = null;

    await act(async () => {
      tree = renderWithAppContext(<EmojiText {...props} />);
    });

    expect(tree).toMatchSnapshot();
  });
});
