import { act } from '@testing-library/react';

import { renderWithAppContext } from '../__helpers__/test-utils';

import { Loading } from './Loading';

describe('renderer/components/Loading.tsx', () => {
  it('should render itself & its children', async () => {
    let tree: ReturnType<typeof renderWithAppContext> | null = null;

    await act(async () => {
      tree = renderWithAppContext(<Loading />);
    });

    expect(tree?.container).toMatchSnapshot();
  });
});
