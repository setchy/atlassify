import { act } from '@testing-library/react';

import { vi } from 'vitest';

import {
  ensureStableEmojis,
  renderWithAppContext,
} from '../__helpers__/test-utils';
import { mockSettings } from '../__mocks__/state-mocks';

import { AllRead } from './AllRead';

// Mock the useFiltersStore
vi.mock('../hooks/useFiltersStore', () => ({
  default: {
    getState: vi.fn(),
  },
}));

import { mockFilterStoreState } from '../__helpers__/test-utils';

import useFiltersStore from '../stores/useFiltersStore';

describe('renderer/components/AllRead.tsx', () => {
  beforeEach(() => {
    ensureStableEmojis();
  });

  it('should render itself & its children - no filters', async () => {
    mockFilterStoreState(useFiltersStore);

    let tree: ReturnType<typeof renderWithAppContext> | null = null;

    await act(async () => {
      tree = renderWithAppContext(<AllRead />, {
        settings: {
          ...mockSettings,
        },
      });
    });

    expect(tree).toMatchSnapshot();
  });

  it('should render itself & its children - with filters', async () => {
    mockFilterStoreState(useFiltersStore, {
      products: ['jira'],
    });

    let tree: ReturnType<typeof renderWithAppContext> | null = null;

    await act(async () => {
      tree = renderWithAppContext(<AllRead />, {
        settings: {
          ...mockSettings,
        },
      });
    });

    expect(tree).toMatchSnapshot();
  });
});
