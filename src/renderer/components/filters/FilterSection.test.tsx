import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { mockAccountNotifications } from '../../__mocks__/notifications-mocks';
import { mockSettings } from '../../__mocks__/state-mocks';
import { AppContext } from '../../context/App';
import { engagementFilter } from '../../utils/notifications/filters';
import { FilterSection } from './FilterSection';

describe('renderer/components/filters/FilterSection.tsx', () => {
  const updateFilter = jest.fn();

  const mockFilter = engagementFilter;
  const mockFilterSetting = 'filterEngagementStates';

  it('should render itself & its children', () => {
    const tree = render(
      <AppContext.Provider
        value={{
          settings: mockSettings,
          notifications: mockAccountNotifications,
        }}
      >
        <FilterSection
          filter={mockFilter}
          filterSetting={mockFilterSetting}
          title={'FilterSectionTitle'}
        />
      </AppContext.Provider>,
    );

    expect(tree).toMatchSnapshot();
  });

  it('should be able to toggle filter value - none already set', async () => {
    render(
      <AppContext.Provider
        value={{
          settings: mockSettings,
          notifications: [],
          updateFilter,
        }}
      >
        <FilterSection
          filter={mockFilter}
          filterSetting={mockFilterSetting}
          title={'FilterSectionTitle'}
        />
      </AppContext.Provider>,
    );

    await userEvent.click(screen.getByLabelText('Mentions'));

    expect(updateFilter).toHaveBeenCalledWith(
      mockFilterSetting,
      'mention',
      true,
    );

    expect(
      screen.getByLabelText('Mentions').parentNode.parentNode,
    ).toMatchSnapshot();
  });

  it('should be able to toggle filter value - some filters already set', async () => {
    render(
      <AppContext.Provider
        value={{
          settings: {
            ...mockSettings,
            filterEngagementStates: ['mention'],
          },
          notifications: [],
          updateFilter,
        }}
      >
        <FilterSection
          filter={mockFilter}
          filterSetting={mockFilterSetting}
          title={'FilterSectionTitle'}
        />
      </AppContext.Provider>,
    );

    await userEvent.click(screen.getByLabelText('Comments'));

    expect(updateFilter).toHaveBeenCalledWith(
      mockFilterSetting,
      'comment',
      true,
    );

    expect(
      screen.getByLabelText('Comments').parentNode.parentNode,
    ).toMatchSnapshot();
  });
});
