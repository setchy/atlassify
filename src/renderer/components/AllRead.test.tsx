import { act, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { mockSettings } from '../__mocks__/state-mocks';
import { ensureStableEmojis } from '../__mocks__/utils';
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
          <MemoryRouter>
            <AllRead />
          </MemoryRouter>
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
          <MemoryRouter>
            <AllRead />
          </MemoryRouter>
        </AppContext.Provider>,
      );
    });

    expect(tree).toMatchSnapshot();
  });
});
