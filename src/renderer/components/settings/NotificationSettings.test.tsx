import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAppContext } from '../../__helpers__/test-utils';

import { useSettingsStore } from '../../stores';

import { NotificationSettings } from './NotificationSettings';

describe('renderer/components/settings/NotificationSettings.tsx', () => {
  let toggleSettingSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    toggleSettingSpy = vi.spyOn(useSettingsStore.getState(), 'toggleSetting');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should toggle the markAsReadOnOpen checkbox', async () => {
    useSettingsStore.setState({ markAsReadOnOpen: true });

    renderWithAppContext(<NotificationSettings />);

    await userEvent.click(screen.getByLabelText('Mark as read on open'));

    expect(toggleSettingSpy).toHaveBeenCalledTimes(1);
    expect(toggleSettingSpy).toHaveBeenCalledWith('markAsReadOnOpen');
  });

  it('should toggle the sortGroupedNotificationsByProductAlphabetically checkbox', async () => {
    renderWithAppContext(<NotificationSettings />);

    await userEvent.click(
      screen.getByLabelText('Group product notifications alphabetically'),
    );

    expect(toggleSettingSpy).toHaveBeenCalledTimes(1);
    expect(toggleSettingSpy).toHaveBeenCalledWith(
      'groupNotificationsByProductAlphabetically',
    );
  });

  it('should toggle the delayNotificationState checkbox', async () => {
    renderWithAppContext(<NotificationSettings />);

    await userEvent.click(screen.getByLabelText('Delay notification state'));

    expect(toggleSettingSpy).toHaveBeenCalledTimes(1);
    expect(toggleSettingSpy).toHaveBeenCalledWith('delayNotificationState');
  });
});
