import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { vi } from 'vitest';

import { renderWithAppContext } from '../__helpers__/test-utils';
import { mockSettings } from '../__mocks__/state-mocks';

import useFiltersStore, {} from '../stores/useFiltersStore';
import { FiltersRoute } from './Filters';

const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => navigateMock,
}));

describe('renderer/routes/Filters.tsx', () => {
  let updateSpy: any;
  let resetSpy: any;
  const fetchNotificationsMock = vi.fn();

  beforeEach(() => {
    // reset store to defaults
    useFiltersStore.getState().reset();

    // spy the actions on the real store
    updateSpy = vi.spyOn((useFiltersStore as any).getState(), 'updateFilter');
    resetSpy = vi.spyOn((useFiltersStore as any).getState(), 'reset');
  });

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

        expect(updateSpy).toHaveBeenCalledWith(
          'engagementStates',
          'mention',
          true,
        );
      });

      it('should filter by engagement state - existing filter set', async () => {
        useFiltersStore.setState({
          engagementStates: ['mention'],
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

        expect(updateSpy).toHaveBeenCalledWith(
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

        expect(updateSpy).toHaveBeenCalledWith('categories', 'direct', true);
      });

      it('should filter by category - existing filter set', async () => {
        useFiltersStore.setState({
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

        expect(updateSpy).toHaveBeenCalledWith('categories', 'direct', false);
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

        expect(updateSpy).toHaveBeenCalledWith('actors', 'automation', true);
      });

      it('should filter by actor - existing filter set', async () => {
        useFiltersStore.setState({
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

        expect(updateSpy).toHaveBeenCalledWith('actors', 'automation', false);
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

        expect(updateSpy).toHaveBeenCalledWith('readStates', 'unread', true);
      });

      it('should filter by read state - existing filter set', async () => {
        useFiltersStore.setState({
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

        expect(updateSpy).toHaveBeenCalledWith('readStates', 'unread', false);
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

        expect(updateSpy).toHaveBeenCalledWith('products', 'bitbucket', true);
      });

      it('should filter by product - existing filter set', async () => {
        useFiltersStore.setState({
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

        expect(updateSpy).toHaveBeenCalledWith('products', 'bitbucket', false);

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

      expect(resetSpy).toHaveBeenCalled();
    });
  });
});
