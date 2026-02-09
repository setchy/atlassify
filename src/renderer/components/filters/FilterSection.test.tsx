import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { vi } from 'vitest';

import { renderWithAppContext } from '../../__helpers__/test-utils';
import { mockAccountNotifications } from '../../__mocks__/notifications-mocks';

import useFiltersStore from '../../stores/useFiltersStore';
import { defaultFiltersState } from '../../stores/defaults';
import { engagementFilter } from '../../utils/notifications/filters';
import { FilterSection } from './FilterSection';

describe('renderer/components/filters/FilterSection.tsx', () => {
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
    // reset store to defaults and spy on the real store action
    (useFiltersStore as any).setState({ ...defaultFiltersState });
    const updateSpy = vi.spyOn(
      (useFiltersStore as any).getState(),
      'updateFilter',
    );

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

    expect(updateSpy).toHaveBeenCalledWith(mockFilterSetting, 'mention', true);

    expect(
      screen.getByLabelText('Mentions').parentNode.parentNode,
    ).toMatchSnapshot();
  });

  it('should be able to toggle filter value - some filters already set', async () => {
    // set store state with 'mention' already set and spy on the real store action
    (useFiltersStore as any).setState({
      ...defaultFiltersState,
      engagementStates: ['mention'],
    });
    const updateSpy = vi.spyOn(
      (useFiltersStore as any).getState(),
      'updateFilter',
    );

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

    expect(updateSpy).toHaveBeenCalledWith(mockFilterSetting, 'comment', true);

    expect(
      screen.getByLabelText('Comments').parentNode.parentNode,
    ).toMatchSnapshot();
  });
});
