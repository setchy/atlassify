import { act } from '@testing-library/react';

import { renderWithProviders } from '../../__helpers__/test-utils';

import { EmojiText, type EmojiTextProps } from './EmojiText';

describe('renderer/components/primitives/Emoji.tsx', () => {
  it('should render', async () => {
    const props: EmojiTextProps = {
      text: '🍺',
    };

    let tree: ReturnType<typeof renderWithProviders> | null = null;

    await act(async () => {
      tree = renderWithProviders(<EmojiText {...props} />);
    });

    expect(tree?.container).toMatchSnapshot();
  });
});
