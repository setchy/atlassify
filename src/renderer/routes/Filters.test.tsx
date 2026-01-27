import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAppContext } from '../__helpers__/test-utils';
import { mockSettings } from '../__mocks__/state-mocks';

import { FiltersRoute } from './Filters';

const navigateMock = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => navigateMock,
}));

describe('renderer/routes/Filters.tsx', () => {
  const updateFilterMock = jest.fn();
  const clearFiltersMock = jest.fn();
  const fetchNotificationsMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
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
            updateFilter: updateFilterMock,
          });
        });

        await userEvent.click(screen.getByLabelText('Mentions'));

        expect(updateFilterMock).toHaveBeenCalledWith(
          'filterEngagementStates',
          'mention',
          true,
        );
      });

      it('should filter by engagement state - existing filter set', async () => {
        await act(async () => {
          renderWithAppContext(<FiltersRoute />, {
            settings: {
              ...mockSettings,
              filterEngagementStates: ['mention'],
            },
            notifications: [],
            updateFilter: updateFilterMock,
          });
        });

        await userEvent.click(screen.getByLabelText('Mentions'));

        expect(updateFilterMock).toHaveBeenCalledWith(
          'filterEngagementStates',
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
            updateFilter: updateFilterMock,
          });
        });

        await userEvent.click(screen.getByLabelText('Direct'));

        expect(updateFilterMock).toHaveBeenCalledWith(
          'filterCategories',
          'direct',
          true,
        );
      });

      it('should filter by category - existing filter set', async () => {
        await act(async () => {
          renderWithAppContext(<FiltersRoute />, {
            settings: {
              ...mockSettings,
              filterCategories: ['direct'],
            },
            notifications: [],
            updateFilter: updateFilterMock,
          });
        });

        await userEvent.click(screen.getByLabelText('Direct'));

        expect(updateFilterMock).toHaveBeenCalledWith(
          'filterCategories',
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
            updateFilter: updateFilterMock,
          });
        });

        await userEvent.click(screen.getByLabelText('Automation'));

        expect(updateFilterMock).toHaveBeenCalledWith(
          'filterActors',
          'automation',
          true,
        );
      });

      it('should filter by actor - existing filter set', async () => {
        await act(async () => {
          renderWithAppContext(<FiltersRoute />, {
            settings: {
              ...mockSettings,
              filterActors: ['automation'],
            },
            notifications: [],
            updateFilter: updateFilterMock,
          });
        });

        await userEvent.click(screen.getByLabelText('Automation'));

        expect(updateFilterMock).toHaveBeenCalledWith(
          'filterActors',
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
            updateFilter: updateFilterMock,
          });
        });

        await userEvent.click(screen.getByLabelText('Unread'));

        expect(updateFilterMock).toHaveBeenCalledWith(
          'filterReadStates',
          'unread',
          true,
        );
      });

      it('should filter by read state - existing filter set', async () => {
        await act(async () => {
          renderWithAppContext(<FiltersRoute />, {
            settings: {
              ...mockSettings,
              filterReadStates: ['unread'],
            },
            notifications: [],
            updateFilter: updateFilterMock,
          });
        });

        await userEvent.click(screen.getByLabelText('Unread'));

        expect(updateFilterMock).toHaveBeenCalledWith(
          'filterReadStates',
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
            updateFilter: updateFilterMock,
          });
        });

        const bitbucketInput = screen.getByRole('checkbox', {
          name: 'Bitbucket',
        });
        await userEvent.click(bitbucketInput);

        expect(updateFilterMock).toHaveBeenCalledWith(
          'filterProducts',
          'bitbucket',
          true,
        );
      });

      it('should filter by product - existing filter set', async () => {
        await act(async () => {
          renderWithAppContext(<FiltersRoute />, {
            settings: {
              ...mockSettings,
              filterProducts: ['bitbucket'],
            },
            notifications: [],
            updateFilter: updateFilterMock,
          });
        });

        const bitbucketInput = screen.getByRole('checkbox', {
          name: 'Bitbucket',
        });
        await userEvent.click(bitbucketInput);

        expect(updateFilterMock).toHaveBeenCalledWith(
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
        renderWithAppContext(<FiltersRoute />, {
          notifications: [],
          clearFilters: clearFiltersMock,
        });
      });

      await userEvent.click(screen.getByTestId('filters-clear'));

      expect(clearFiltersMock).toHaveBeenCalled();
    });
  });
});
