import { vi } from 'vitest';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAppContext } from '../../__helpers__/test-utils';
import { mockAccountNotifications } from '../../__mocks__/notifications-mocks';

import { engagementFilter } from '../../utils/notifications/filters';
import { FilterSection } from './FilterSection';

describe('renderer/components/filters/FilterSection.tsx', () => {
  const updateFilterMock = vi.fn();

  const mockFilter = engagementFilter;
  const mockFilterSetting = 'filterEngagementStates';

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
    renderWithAppContext(
      <FilterSection
        filter={mockFilter}
        filterSetting={mockFilterSetting}
        title={'FilterSectionTitle'}
      />,
      {
        notifications: [],
        updateFilter: updateFilterMock,
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
    renderWithAppContext(
      <FilterSection
        filter={mockFilter}
        filterSetting={mockFilterSetting}
        title={'FilterSectionTitle'}
      />,
      {
        settings: {
          filterEngagementStates: ['mention'],
        },
        notifications: [],
        updateFilter: updateFilterMock,
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
