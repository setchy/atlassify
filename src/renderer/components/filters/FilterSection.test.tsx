import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { vi } from 'vitest';

import { renderWithAppContext, mockFilterStoreState } from '../../__helpers__/test-utils';
import { mockAccountNotifications } from '../../__mocks__/notifications-mocks';

import { engagementFilter } from '../../utils/notifications/filters';
import { FilterSection } from './FilterSection';
import useFiltersStore from '../../hooks/useFiltersStore';

describe('renderer/components/filters/FilterSection.tsx', () => {
  const updateFilterMock = vi.fn();

  const mockFilter = engagementFilter;
  const mockFilterSetting = 'engagementStates';

  it('should render itself & its children', () => {
    const tree = renderWithAppContext(
      <FilterSection
        filter={mockFilter}
        filterSetting={mockFilterSetting}
        title={'FilterSectionTitle'}
      />,
      {
        notifications: mockAccountNotifications,
      },
    );

    expect(tree).toMatchSnapshot();
  });

  it('should be able to toggle filter value - none already set', async () => {
    // mock store with default filters and inject our mock updateFilter
    mockFilterStoreState(useFiltersStore);
    vi.mocked(useFiltersStore.getState).mockReturnValue({
      ...useFiltersStore.getState(),
      updateFilter: updateFilterMock,
    });

    renderWithAppContext(
      <FilterSection
        filter={mockFilter}
        filterSetting={mockFilterSetting}
        title={'FilterSectionTitle'}
      />,
      {
        notifications: [],
      },
    );

    await userEvent.click(screen.getByLabelText('Mentions'));

    expect(updateFilterMock).toHaveBeenCalledWith(
      mockFilterSetting,
      'mention',
      true,
    );

    expect(
      screen.getByLabelText('Mentions').parentNode.parentNode,
    ).toMatchSnapshot();
  });

  it('should be able to toggle filter value - some filters already set', async () => {
    // mock store with 'mention' already set and inject our mock updateFilter
    mockFilterStoreState(useFiltersStore, { engagementStates: ['mention'] });
    vi.mocked(useFiltersStore.getState).mockReturnValue({
      ...useFiltersStore.getState(),
      updateFilter: updateFilterMock,
    });

    renderWithAppContext(
      <FilterSection
        filter={mockFilter}
        filterSetting={mockFilterSetting}
        title={'FilterSectionTitle'}
      />,
      {
        notifications: [],
      },
    );

    await userEvent.click(screen.getByLabelText('Comments'));

    expect(updateFilterMock).toHaveBeenCalledWith(
      mockFilterSetting,
      'comment',
      true,
    );

    expect(
      screen.getByLabelText('Comments').parentNode.parentNode,
    ).toMatchSnapshot();
  });
});
