import { act } from '@testing-library/react';

import { renderWithProviders } from '../__helpers__/test-utils';

import { Oops } from './Oops';

describe('renderer/components/Oops.tsx', () => {
  it('should render itself & its children - specified error', async () => {
    const mockError = {
      title: 'Error title',
      descriptions: ['Error description'],
      emojis: ['🔥'],
    };

    let tree: ReturnType<typeof renderWithProviders> | null = null;

    await act(async () => {
      tree = renderWithProviders(<Oops error={mockError} />);
    });

    expect(tree?.container).toMatchSnapshot();
  });

  it('should render itself & its children - fallback to unknown error', async () => {
    let tree: ReturnType<typeof renderWithProviders> | null = null;

    await act(async () => {
      tree = renderWithProviders(<Oops error={null} />);
    });

    expect(tree?.container).toMatchSnapshot();
  });
});
