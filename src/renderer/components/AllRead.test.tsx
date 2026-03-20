import { act } from '@testing-library/react';

import { renderWithAppContext } from '../__helpers__/test-utils';

import { AllRead } from './AllRead';

describe('renderer/components/AllRead.tsx', () => {
  it('should render itself & its children - no filters', async () => {
    let tree: ReturnType<typeof renderWithAppContext> | null = null;

    await act(async () => {
      tree = renderWithAppContext(<AllRead />);
    });

    expect(tree?.container).toMatchSnapshot();
  });

  it('should render itself & its children - with filters', async () => {
    let tree: ReturnType<typeof renderWithAppContext> | null = null;

    await act(async () => {
      tree = renderWithAppContext(<AllRead />, {
        filtersStore: { products: ['jira'] },
      });
    });

    expect(tree?.container).toMatchSnapshot();
  });
});
