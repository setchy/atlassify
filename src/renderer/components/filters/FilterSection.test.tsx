import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { mockAccountNotifications } from '../../__mocks__/notifications-mocks';
import { mockSettings } from '../../__mocks__/state-mocks';
import { AppContext } from '../../context/App';
import { timeSensitiveFilter } from '../../utils/notifications/filters';
import { FilterSection } from './FilterSection';

describe('renderer/components/filters/FilterSection.tsx', () => {
  const updateFilter = jest.fn();

  const mockFilter = timeSensitiveFilter;
  const mockFilterSetting = 'filterTimeSensitive';

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
        <MemoryRouter>
          <FilterSection
            filter={mockFilter}
            filterSetting={mockFilterSetting}
            title={'FilterSectionTitle'}
          />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    await userEvent.click(screen.getByLabelText('Mention'));

    expect(updateFilter).toHaveBeenCalledWith(
      mockFilterSetting,
      'mention',
      true,
    );

    expect(
      screen.getByLabelText('Mention').parentNode.parentNode,
    ).toMatchSnapshot();
  });

  it('should be able to toggle filter value - some filters already set', async () => {
    render(
      <AppContext.Provider
        value={{
          settings: {
            ...mockSettings,
            filterTimeSensitive: ['mention'],
          },
          notifications: [],
          updateFilter,
        }}
      >
        <MemoryRouter>
          <FilterSection
            filter={mockFilter}
            filterSetting={mockFilterSetting}
            title={'FilterSectionTitle'}
          />
        </MemoryRouter>
      </AppContext.Provider>,
    );

    await userEvent.click(screen.getByLabelText('Comment'));

    expect(updateFilter).toHaveBeenCalledWith(
      mockFilterSetting,
      'comment',
      true,
    );

    expect(
      screen.getByLabelText('Comment').parentNode.parentNode,
    ).toMatchSnapshot();
  });
});
