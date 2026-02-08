import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { vi } from 'vitest';

import {
  mockFilterStoreState,
  renderWithAppContext,
} from '../__helpers__/test-utils';
import { mockSettings } from '../__mocks__/state-mocks';

import { FiltersRoute } from './Filters';

// Mock the useFiltersStore
vi.mock('../hooks/useFiltersStore', () => ({
  default: {
    getState: vi.fn(),
  },
}));

import useFiltersStore, {
  defaultFiltersState,
  type FiltersState,
} from '../hooks/useFiltersStore';

const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => navigateMock,
}));

describe('renderer/routes/Filters.tsx', () => {
  const updateFilterMock = vi.fn();
  const clearFiltersMock = vi.fn();
  const fetchNotificationsMock = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('General', () => {
    it('should render itself & its children', async () => {
      await act(async () => {
        renderWithAppContext(<FiltersRoute />, {
          notifications: [],
        });
      });

      expect(screen.getByTestId('filters')).toMatchSnapshot();
    });

    it('should go back by pressing the icon', async () => {
      await act(async () => {
        renderWithAppContext(<FiltersRoute />, {
          fetchNotifications: fetchNotificationsMock,
          notifications: [],
        });
      });

      await userEvent.click(screen.getByTestId('header-nav-back'));

      expect(fetchNotificationsMock).toHaveBeenCalledTimes(1);
      expect(navigateMock).toHaveBeenCalledTimes(1);
      expect(navigateMock).toHaveBeenCalledWith(-1);
    });
  });

  describe('filters', () => {
    describe('time sensitive filters', () => {
      it('should filter by time sensitive - no existing filters set', async () => {
        await act(async () => {
          renderWithAppContext(<FiltersRoute />, {
            notifications: [],
          });
        });

        await userEvent.click(screen.getByLabelText('Mentions'));

        expect(updateFilterMock).toHaveBeenCalledWith(
          'engagementStates',
          'mention',
          true,
        );
      });

      it('should filter by engagement state - existing filter set', async () => {
        vi.mocked(useFiltersStore.getState).mockReturnValue({
          ...defaultFiltersState,
          engagementStates: ['mention'],
        } as FiltersState & {
          setFilters: any;
          updateFilter: any;
          clearFilters: any;
        });

        await act(async () => {
          renderWithAppContext(<FiltersRoute />, {
            settings: {
              ...mockSettings,
            },
            notifications: [],
          });
        });

        await userEvent.click(screen.getByLabelText('Mentions'));

        expect(updateFilterMock).toHaveBeenCalledWith(
          'engagementStates',
          'mention',
          false,
        );
      });
    });

    describe('category filters', () => {
      it('should filter by category - no existing filters set', async () => {
        await act(async () => {
          renderWithAppContext(<FiltersRoute />, {
            notifications: [],
          });
        });

        await userEvent.click(screen.getByLabelText('Direct'));

        expect(updateFilterMock).toHaveBeenCalledWith(
          'categories',
          'direct',
          true,
        );
      });

      it('should filter by category - existing filter set', async () => {
        mockFilterStoreState(useFiltersStore, {
          categories: ['direct'],
        });

        await act(async () => {
          renderWithAppContext(<FiltersRoute />, {
            settings: {
              ...mockSettings,
            },
            notifications: [],
          });
        });

        await userEvent.click(screen.getByLabelText('Direct'));

        expect(updateFilterMock).toHaveBeenCalledWith(
          'categories',
          'direct',
          false,
        );
      });
    });

    describe('actor filters', () => {
      it('should filter by actor - no existing filters set', async () => {
        await act(async () => {
          renderWithAppContext(<FiltersRoute />, {
            notifications: [],
          });
        });

        await userEvent.click(screen.getByLabelText('Automation'));

        expect(updateFilterMock).toHaveBeenCalledWith(
          'actors',
          'automation',
          true,
        );
      });

      it('should filter by actor - existing filter set', async () => {
        mockFilterStoreState(useFiltersStore, {
          actors: ['automation'],
        });

        await act(async () => {
          renderWithAppContext(<FiltersRoute />, {
            settings: {
              ...mockSettings,
            },
            notifications: [],
          });
        });

        await userEvent.click(screen.getByLabelText('Automation'));

        expect(updateFilterMock).toHaveBeenCalledWith(
          'actors',
          'automation',
          false,
        );
      });
    });

    describe('read state filters', () => {
      it('should filter by read state - no existing filters set', async () => {
        await act(async () => {
          renderWithAppContext(<FiltersRoute />, {
            notifications: [],
          });
        });

        await userEvent.click(screen.getByLabelText('Unread'));

        expect(updateFilterMock).toHaveBeenCalledWith(
          'readStates',
          'unread',
          true,
        );
      });

      it('should filter by read state - existing filter set', async () => {
        mockFilterStoreState(useFiltersStore, {
          readStates: ['unread'],
        });

        await act(async () => {
          renderWithAppContext(<FiltersRoute />, {
            settings: {
              ...mockSettings,
            },
            notifications: [],
          });
        });

        await userEvent.click(screen.getByLabelText('Unread'));

        expect(updateFilterMock).toHaveBeenCalledWith(
          'readStates',
          'unread',
          false,
        );
      });
    });

    describe('product filters', () => {
      it('should filter by product - no existing filters set', async () => {
        await act(async () => {
          renderWithAppContext(<FiltersRoute />, {
            notifications: [],
          });
        });

        const bitbucketInput = screen.getByRole('checkbox', {
          name: 'Bitbucket',
        });
        await userEvent.click(bitbucketInput);

        expect(updateFilterMock).toHaveBeenCalledWith(
          'products',
          'bitbucket',
          true,
        );
      });

      it('should filter by product - existing filter set', async () => {
        mockFilterStoreState(useFiltersStore, {
          products: ['bitbucket'],
        });

        await act(async () => {
          renderWithAppContext(<FiltersRoute />, {
            settings: {
              ...mockSettings,
            },
            notifications: [],
          });
        });

        const bitbucketInput = screen.getByRole('checkbox', {
          name: 'Bitbucket',
        });
        await userEvent.click(bitbucketInput);

        expect(updateFilterMock).toHaveBeenCalledWith(
          'products',
          'bitbucket',
          false,
        );

        expect(screen.getByTestId('filters')).toMatchSnapshot();
      });
    });
  });

  describe('Footer section', () => {
    it('should clear filters', async () => {
      await act(async () => {
        renderWithAppContext(<FiltersRoute />, {
          notifications: [],
        });
      });

      await userEvent.click(screen.getByTestId('filters-clear'));

      expect(clearFiltersMock).toHaveBeenCalled();
    });
  });
});
