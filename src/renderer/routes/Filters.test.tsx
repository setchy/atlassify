import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAppContext } from '../__helpers__/test-utils';

import type { FiltersStore } from '../stores/types';
import useFiltersStore from '../stores/useFiltersStore';

import { FiltersRoute } from './Filters';

const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => navigateMock,
}));

describe('renderer/routes/Filters.tsx', () => {
  let updateSpy: ReturnType<typeof vi.spyOn>;
  let resetSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // spy the actions on the real store
    updateSpy = vi.spyOn(
      useFiltersStore.getState() as FiltersStore,
      'updateFilter',
    );
    resetSpy = vi.spyOn(useFiltersStore.getState() as FiltersStore, 'reset');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('General', () => {
    it('should render itself & its children', async () => {
      renderWithAppContext(<FiltersRoute />, {
        notifications: [],
      });

      expect(screen.getByTestId('filters')).toMatchSnapshot();
    });

    it('should go back by pressing the icon', async () => {
      renderWithAppContext(<FiltersRoute />, {
        notifications: [],
      });

      await userEvent.click(screen.getByTestId('header-nav-back'));

      expect(navigateMock).toHaveBeenCalledTimes(1);
      expect(navigateMock).toHaveBeenCalledWith(-1);
    });
  });

  describe('filters', () => {
    describe('time sensitive filters', () => {
      it('should filter by time sensitive - no existing filters set', async () => {
        renderWithAppContext(<FiltersRoute />, {
          notifications: [],
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

        renderWithAppContext(<FiltersRoute />, {
          notifications: [],
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
        renderWithAppContext(<FiltersRoute />, {
          notifications: [],
        });

        await userEvent.click(screen.getByLabelText('Direct'));

        expect(updateSpy).toHaveBeenCalledWith('categories', 'direct', true);
      });

      it('should filter by category - existing filter set', async () => {
        useFiltersStore.setState({
          categories: ['direct'],
        });

        renderWithAppContext(<FiltersRoute />, {
          notifications: [],
        });

        await userEvent.click(screen.getByLabelText('Direct'));

        expect(updateSpy).toHaveBeenCalledWith('categories', 'direct', false);
      });
    });

    describe('actor filters', () => {
      it('should filter by actor - no existing filters set', async () => {
        renderWithAppContext(<FiltersRoute />, {
          notifications: [],
        });

        await userEvent.click(screen.getByLabelText('Automation'));

        expect(updateSpy).toHaveBeenCalledWith('actors', 'automation', true);
      });

      it('should filter by actor - existing filter set', async () => {
        useFiltersStore.setState({
          actors: ['automation'],
        });

        renderWithAppContext(<FiltersRoute />, {
          notifications: [],
        });

        await userEvent.click(screen.getByLabelText('Automation'));

        expect(updateSpy).toHaveBeenCalledWith('actors', 'automation', false);
      });
    });

    describe('read state filters', () => {
      it('should filter by read state - no existing filters set', async () => {
        renderWithAppContext(<FiltersRoute />, {
          notifications: [],
        });

        await userEvent.click(screen.getByLabelText('Unread'));

        expect(updateSpy).toHaveBeenCalledWith('readStates', 'unread', true);
      });

      it('should filter by read state - existing filter set', async () => {
        useFiltersStore.setState({
          readStates: ['unread'],
        });

        renderWithAppContext(<FiltersRoute />, {
          notifications: [],
        });

        await userEvent.click(screen.getByLabelText('Unread'));

        expect(updateSpy).toHaveBeenCalledWith('readStates', 'unread', false);
      });
    });

    describe('product filters', () => {
      it('should filter by product - no existing filters set', async () => {
        renderWithAppContext(<FiltersRoute />, {
          notifications: [],
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

        renderWithAppContext(<FiltersRoute />, {
          notifications: [],
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
      renderWithAppContext(<FiltersRoute />, {
        notifications: [],
      });

      await userEvent.click(screen.getByTestId('filters-clear'));

      expect(resetSpy).toHaveBeenCalled();
    });
  });
});
