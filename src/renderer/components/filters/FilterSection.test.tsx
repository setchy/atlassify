import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAppContext } from '../../__helpers__/test-utils';
import { mockAccountNotifications } from '../../__mocks__/notifications-mocks';

import { useFiltersStore } from '../../stores';

import { engagementFilter } from '../../utils/notifications/filters';
import { FilterSection } from './FilterSection';

describe('renderer/components/filters/FilterSection.tsx', () => {
  const mockFilter = engagementFilter;
  const mockFilterSetting = 'engagementStates';
  let updateFilterSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    updateFilterSpy = vi.spyOn(useFiltersStore.getState(), 'updateFilter');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

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

    expect(tree.container).toMatchSnapshot();
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
      },
    );

    await userEvent.click(screen.getByLabelText('Mentions'));

    expect(updateFilterSpy).toHaveBeenCalledWith(
      mockFilterSetting,
      'mention',
      true,
    );

    expect(
      screen.getByLabelText('Mentions').parentNode.parentNode,
    ).toMatchSnapshot();
  });

  it('should be able to toggle filter value - some filters already set', async () => {
    useFiltersStore.setState({ engagementStates: ['mention'] });

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

    expect(updateFilterSpy).toHaveBeenCalledWith(
      mockFilterSetting,
      'comment',
      true,
    );

    expect(
      screen.getByLabelText('Comments').parentNode.parentNode,
    ).toMatchSnapshot();
  });
});
