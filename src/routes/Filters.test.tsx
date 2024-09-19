import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { mockAuth, mockSettings } from '../__mocks__/state-mocks';
import { AppContext } from '../context/App';
import { FiltersRoute } from './Filters';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('routes/Filters.tsx', () => {
  const updateSetting = jest.fn();
  const clearFilters = jest.fn();
  const fetchNotifications = jest.fn();

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

      fireEvent.click(screen.getByTitle('Go Back'));
      expect(fetchNotifications).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenNthCalledWith(1, -1);
    });
  });

  describe('filters', () => {
    describe('category filters', () => {
      it('should filter by category - no existing filters set', async () => {
        await act(async () => {
          render(
            <AppContext.Provider
              value={{
                auth: mockAuth,
                settings: mockSettings,
                notifications: [],
                updateSetting,
              }}
            >
              <MemoryRouter>
                <FiltersRoute />
              </MemoryRouter>
            </AppContext.Provider>,
          );
        });

        fireEvent.click(screen.getByTitle('direct'));

        expect(updateSetting).toHaveBeenCalledWith('filterCategories', [
          'direct',
        ]);
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
                updateSetting,
              }}
            >
              <MemoryRouter>
                <FiltersRoute />
              </MemoryRouter>
            </AppContext.Provider>,
          );
        });

        fireEvent.click(screen.getByTitle('direct'));

        expect(updateSetting).toHaveBeenCalledWith('filterCategories', []);
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
                updateSetting,
              }}
            >
              <MemoryRouter>
                <FiltersRoute />
              </MemoryRouter>
            </AppContext.Provider>,
          );
        });

        fireEvent.click(screen.getByTitle('unread'));

        expect(updateSetting).toHaveBeenCalledWith('filterReadStates', [
          'unread',
        ]);
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
                updateSetting,
              }}
            >
              <MemoryRouter>
                <FiltersRoute />
              </MemoryRouter>
            </AppContext.Provider>,
          );
        });

        fireEvent.click(screen.getByTitle('unread'));

        expect(updateSetting).toHaveBeenCalledWith('filterReadStates', []);
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
                updateSetting,
              }}
            >
              <MemoryRouter>
                <FiltersRoute />
              </MemoryRouter>
            </AppContext.Provider>,
          );
        });

        fireEvent.click(screen.getByTitle('bitbucket'));

        expect(updateSetting).toHaveBeenCalledWith('filterProducts', [
          'bitbucket',
        ]);
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
                updateSetting,
              }}
            >
              <MemoryRouter>
                <FiltersRoute />
              </MemoryRouter>
            </AppContext.Provider>,
          );
        });

        fireEvent.click(screen.getByTitle('bitbucket'));

        expect(updateSetting).toHaveBeenCalledWith('filterProducts', []);

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

      fireEvent.click(screen.getByTitle('Clear Filters'));

      expect(clearFilters).toHaveBeenCalled();
    });
  });
});
