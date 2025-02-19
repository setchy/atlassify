import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { mockNavigate } from '../__mocks__/navigation';
import { mockAuth, mockSettings } from '../__mocks__/state';

import { AppContext } from '../context/App';
import { FiltersRoute } from './Filters';

describe('renderer/routes/Filters.tsx', () => {
  const updateFilter = vi.fn();
  const clearFilters = vi.fn();
  const fetchNotifications = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
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
            <MemoryRouter>
              <FiltersRoute />
            </MemoryRouter>
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
              fetchNotifications,
              notifications: [],
            }}
          >
            <MemoryRouter>
              <FiltersRoute />
            </MemoryRouter>
          </AppContext.Provider>,
        );
      });

      fireEvent.click(screen.getByTestId('header-nav-back'));

      expect(fetchNotifications).toHaveBeenCalledTimes(1);
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
                updateFilter,
              }}
            >
              <MemoryRouter>
                <FiltersRoute />
              </MemoryRouter>
            </AppContext.Provider>,
          );
        });

        fireEvent.click(screen.getByLabelText('mention'));

        expect(updateFilter).toHaveBeenCalledWith(
          'filterTimeSensitive',
          'mention',
          true,
        );
      });

      it('should filter by time sensitive - existing filter set', async () => {
        await act(async () => {
          render(
            <AppContext.Provider
              value={{
                auth: mockAuth,
                settings: {
                  ...mockSettings,
                  filterTimeSensitive: ['mention'],
                },
                notifications: [],
                updateFilter,
              }}
            >
              <MemoryRouter>
                <FiltersRoute />
              </MemoryRouter>
            </AppContext.Provider>,
          );
        });

        fireEvent.click(screen.getByLabelText('mention'));

        expect(updateFilter).toHaveBeenCalledWith(
          'filterTimeSensitive',
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
                updateFilter,
              }}
            >
              <MemoryRouter>
                <FiltersRoute />
              </MemoryRouter>
            </AppContext.Provider>,
          );
        });

        fireEvent.click(screen.getByLabelText('direct'));

        expect(updateFilter).toHaveBeenCalledWith(
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
                updateFilter,
              }}
            >
              <MemoryRouter>
                <FiltersRoute />
              </MemoryRouter>
            </AppContext.Provider>,
          );
        });

        fireEvent.click(screen.getByLabelText('direct'));

        expect(updateFilter).toHaveBeenCalledWith(
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
                updateFilter,
              }}
            >
              <MemoryRouter>
                <FiltersRoute />
              </MemoryRouter>
            </AppContext.Provider>,
          );
        });

        fireEvent.click(screen.getByLabelText('automation'));

        expect(updateFilter).toHaveBeenCalledWith(
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
                updateFilter,
              }}
            >
              <MemoryRouter>
                <FiltersRoute />
              </MemoryRouter>
            </AppContext.Provider>,
          );
        });

        fireEvent.click(screen.getByLabelText('automation'));

        expect(updateFilter).toHaveBeenCalledWith(
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
                updateFilter,
              }}
            >
              <MemoryRouter>
                <FiltersRoute />
              </MemoryRouter>
            </AppContext.Provider>,
          );
        });

        fireEvent.click(screen.getByLabelText('unread'));

        expect(updateFilter).toHaveBeenCalledWith(
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
                updateFilter,
              }}
            >
              <MemoryRouter>
                <FiltersRoute />
              </MemoryRouter>
            </AppContext.Provider>,
          );
        });

        fireEvent.click(screen.getByLabelText('unread'));

        expect(updateFilter).toHaveBeenCalledWith(
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
                updateFilter,
              }}
            >
              <MemoryRouter>
                <FiltersRoute />
              </MemoryRouter>
            </AppContext.Provider>,
          );
        });

        fireEvent.click(screen.getByLabelText('bitbucket'));

        expect(updateFilter).toHaveBeenCalledWith(
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
                updateFilter,
              }}
            >
              <MemoryRouter>
                <FiltersRoute />
              </MemoryRouter>
            </AppContext.Provider>,
          );
        });

        fireEvent.click(screen.getByLabelText('bitbucket'));

        expect(updateFilter).toHaveBeenCalledWith(
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
              clearFilters,
            }}
          >
            <MemoryRouter>
              <FiltersRoute />
            </MemoryRouter>
          </AppContext.Provider>,
        );
      });

      fireEvent.click(screen.getByTestId('filters-clear'));

      expect(clearFilters).toHaveBeenCalled();
    });
  });
});
