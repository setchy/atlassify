import { act } from '@testing-library/react';

import { renderWithProviders } from '../__helpers__/test-utils';

import { Loading } from './Loading';

describe('renderer/components/Loading.tsx', () => {
  it('should render itself & its children', async () => {
    let tree: ReturnType<typeof renderWithProviders> | null = null;

    await act(async () => {
      tree = renderWithProviders(<Loading />);
    });

    expect(tree?.container).toMatchSnapshot();
  });
});
