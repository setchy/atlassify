import { act, render } from '@testing-library/react';

import { ensureStableEmojis } from '../__helpers__/test-utils';
import { mockSettings } from '../__mocks__/state-mocks';
import { AppContext } from '../context/App';
import { AllRead } from './AllRead';

describe('renderer/components/AllRead.tsx', () => {
  beforeEach(() => {
    ensureStableEmojis();
  });

  it('should render itself & its children - no filters', async () => {
    let tree: ReturnType<typeof render> | null = null;

    await act(async () => {
      tree = render(
        <AppContext.Provider
          value={{
            settings: {
              ...mockSettings,
            },
          }}
        >
          <AllRead />
        </AppContext.Provider>,
      );
    });

    expect(tree).toMatchSnapshot();
  });

  it('should render itself & its children - with filters', async () => {
    let tree: ReturnType<typeof render> | null = null;

    await act(async () => {
      tree = render(
        <AppContext.Provider
          value={{
            settings: {
              ...mockSettings,
              filterProducts: ['jira'],
            },
          }}
        >
          <AllRead />
        </AppContext.Provider>,
      );
    });

    expect(tree).toMatchSnapshot();
  });
});
