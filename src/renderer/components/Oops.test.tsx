import { act, render } from '@testing-library/react';

import { Oops } from './Oops';

describe('renderer/components/Oops.tsx', () => {
  it('should render itself & its children', async () => {
    const mockError = {
      title: 'Error title',
      descriptions: ['Error description'],
      emojis: ['🔥'],
    };

    let tree: ReturnType<typeof render> | null = null;

    await act(async () => {
      tree = render(<Oops error={mockError} />);
    });

    expect(tree).toMatchSnapshot();
  });
});
