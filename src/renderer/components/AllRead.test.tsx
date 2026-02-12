import { act } from '@testing-library/react';

import {
  ensureStableEmojis,
  renderWithAppContext,
} from '../__helpers__/test-utils';

import useFiltersStore from '../stores/useFiltersStore';

import { AllRead } from './AllRead';

describe('renderer/components/AllRead.tsx', () => {
  beforeEach(() => {
    ensureStableEmojis();
  });

  it('should render itself & its children - no filters', async () => {
    let tree: ReturnType<typeof renderWithAppContext> | null = null;

    await act(async () => {
      tree = renderWithAppContext(<AllRead />);
    });

    expect(tree).toMatchSnapshot();
  });

  it('should render itself & its children - with filters', async () => {
    useFiltersStore.setState({ products: ['jira'] });

    let tree: ReturnType<typeof renderWithAppContext> | null = null;

    await act(async () => {
      tree = renderWithAppContext(<AllRead />);
    });

    expect(tree).toMatchSnapshot();
  });
});
