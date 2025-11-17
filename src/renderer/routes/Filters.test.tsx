import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { mockAuth, mockSettings } from '../__mocks__/state-mocks';
import { AppContext } from '../context/App';
import { FiltersRoute } from './Filters';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('renderer/routes/Filters.tsx', () => {
  const mockUpdateFilter = jest.fn();
  const mockClearFilters = jest.fn();
  const mockFetchNotifications = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('General', () => {
    it('should render itself & its children', async () => {
      await act(async () => {
        render(
          <AppContext.Provider
            value={{
              auth: mockAuth,
              settings: mockSettings,
              notifications: [],
            }}
          >
            <FiltersRoute />
          </AppContext.Provider>,
        );
      });

      expect(screen.getByTestId('filters')).toMatchSnapshot();
    });

    it('should go back by pressing the icon', async () => {
      await act(async () => {
        render(
          <AppContext.Provider
            value={{
              auth: mockAuth,
              settings: mockSettings,
              fetchNotifications: mockFetchNotifications,
              notifications: [],
            }}
          >
            <FiltersRoute />
          </AppContext.Provider>,
        );
      });

      await userEvent.click(screen.getByTestId('header-nav-back'));

      expect(mockFetchNotifications).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenNthCalledWith(1, -1);
    });
  });

  describe('filters', () => {
    describe('time sensitive filters', () => {
      it('should filter by time sensitive - no existing filters set', async () => {
        await act(async () => {
          render(
            <AppContext.Provider
              value={{
                auth: mockAuth,
                settings: mockSettings,
                notifications: [],
                updateFilter: mockUpdateFilter,
              }}
            >
              <FiltersRoute />
            </AppContext.Provider>,
          );
        });

        await userEvent.click(screen.getByLabelText('Mentions'));

        expect(mockUpdateFilter).toHaveBeenCalledWith(
          'filterEngagementStates',
          'mention',
          true,
        );
      });

      it('should filter by engagement state - existing filter set', async () => {
        await act(async () => {
          render(
            <AppContext.Provider
              value={{
                auth: mockAuth,
                settings: {
                  ...mockSettings,
                  filterEngagementStates: ['mention'],
                },
                notifications: [],
                updateFilter: mockUpdateFilter,
              }}
            >
              <FiltersRoute />
            </AppContext.Provider>,
          );
        });

        await userEvent.click(screen.getByLabelText('Mentions'));

        expect(mockUpdateFilter).toHaveBeenCalledWith(
          'filterEngagementStates',
          'mention',
          false,
        );
      });
    });

    describe('category filters', () => {
      it('should filter by category - no existing filters set', async () => {
        await act(async () => {
          render(
            <AppContext.Provider
              value={{
                auth: mockAuth,
                settings: mockSettings,
                notifications: [],
                updateFilter: mockUpdateFilter,
              }}
            >
              <FiltersRoute />
            </AppContext.Provider>,
          );
        });

        await userEvent.click(screen.getByLabelText('Direct'));

        expect(mockUpdateFilter).toHaveBeenCalledWith(
          'filterCategories',
          'direct',
          true,
        );
      });

      it('should filter by category - existing filter set', async () => {
        await act(async () => {
          render(
            <AppContext.Provider
              value={{
                auth: mockAuth,
                settings: {
                  ...mockSettings,
                  filterCategories: ['direct'],
                },
                notifications: [],
                updateFilter: mockUpdateFilter,
              }}
            >
              <FiltersRoute />
            </AppContext.Provider>,
          );
        });

        await userEvent.click(screen.getByLabelText('Direct'));

        expect(mockUpdateFilter).toHaveBeenCalledWith(
          'filterCategories',
          'direct',
          false,
        );
      });
    });

    describe('actor filters', () => {
      it('should filter by actor - no existing filters set', async () => {
        await act(async () => {
          render(
            <AppContext.Provider
              value={{
                auth: mockAuth,
                settings: mockSettings,
                notifications: [],
                updateFilter: mockUpdateFilter,
              }}
            >
              <FiltersRoute />
            </AppContext.Provider>,
          );
        });

        await userEvent.click(screen.getByLabelText('Automation'));

        expect(mockUpdateFilter).toHaveBeenCalledWith(
          'filterActors',
          'automation',
          true,
        );
      });

      it('should filter by actor - existing filter set', async () => {
        await act(async () => {
          render(
            <AppContext.Provider
              value={{
                auth: mockAuth,
                settings: {
                  ...mockSettings,
                  filterActors: ['automation'],
                },
                notifications: [],
                updateFilter: mockUpdateFilter,
              }}
            >
              <FiltersRoute />
            </AppContext.Provider>,
          );
        });

        await userEvent.click(screen.getByLabelText('Automation'));

        expect(mockUpdateFilter).toHaveBeenCalledWith(
          'filterActors',
          'automation',
          false,
        );
      });
    });

    describe('read state filters', () => {
      it('should filter by read state - no existing filters set', async () => {
        await act(async () => {
          render(
            <AppContext.Provider
              value={{
                auth: mockAuth,
                settings: mockSettings,
                notifications: [],
                updateFilter: mockUpdateFilter,
              }}
            >
              <FiltersRoute />
            </AppContext.Provider>,
          );
        });

        await userEvent.click(screen.getByLabelText('Unread'));

        expect(mockUpdateFilter).toHaveBeenCalledWith(
          'filterReadStates',
          'unread',
          true,
        );
      });

      it('should filter by read state - existing filter set', async () => {
        await act(async () => {
          render(
            <AppContext.Provider
              value={{
                auth: mockAuth,
                settings: {
                  ...mockSettings,
                  filterReadStates: ['unread'],
                },
                notifications: [],
                updateFilter: mockUpdateFilter,
              }}
            >
              <FiltersRoute />
            </AppContext.Provider>,
          );
        });

        await userEvent.click(screen.getByLabelText('Unread'));

        expect(mockUpdateFilter).toHaveBeenCalledWith(
          'filterReadStates',
          'unread',
          false,
        );
      });
    });

    describe('product filters', () => {
      it('should filter by product - no existing filters set', async () => {
        await act(async () => {
          render(
            <AppContext.Provider
              value={{
                auth: mockAuth,
                settings: mockSettings,
                notifications: [],
                updateFilter: mockUpdateFilter,
              }}
            >
              <FiltersRoute />
            </AppContext.Provider>,
          );
        });

        const bitbucketInput = screen.getByRole('checkbox', {
          name: 'Bitbucket',
        });
        await userEvent.click(bitbucketInput);

        expect(mockUpdateFilter).toHaveBeenCalledWith(
          'filterProducts',
          'bitbucket',
          true,
        );
      });

      it('should filter by product - existing filter set', async () => {
        await act(async () => {
          render(
            <AppContext.Provider
              value={{
                auth: mockAuth,
                settings: {
                  ...mockSettings,
                  filterProducts: ['bitbucket'],
                },
                notifications: [],
                updateFilter: mockUpdateFilter,
              }}
            >
              <FiltersRoute />
            </AppContext.Provider>,
          );
        });

        const bitbucketInput = screen.getByRole('checkbox', {
          name: 'Bitbucket',
        });
        await userEvent.click(bitbucketInput);

        expect(mockUpdateFilter).toHaveBeenCalledWith(
          'filterProducts',
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
        render(
          <AppContext.Provider
            value={{
              auth: mockAuth,
              settings: mockSettings,
              notifications: [],
              clearFilters: mockClearFilters,
            }}
          >
            <FiltersRoute />
          </AppContext.Provider>,
        );
      });

      await userEvent.click(screen.getByTestId('filters-clear'));

      expect(mockClearFilters).toHaveBeenCalled();
    });
  });
});
