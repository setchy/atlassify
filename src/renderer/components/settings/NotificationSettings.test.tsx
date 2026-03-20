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

  it('should toggle the markAsReadOnOpen checkbox', async () => {
    renderWithAppContext(<NotificationSettings />, {
      settingsStore: { markAsReadOnOpen: true },
    });

    await userEvent.click(screen.getByLabelText('Mark as read on open'));

    expect(toggleSettingSpy).toHaveBeenCalledTimes(1);
    expect(toggleSettingSpy).toHaveBeenCalledWith('markAsReadOnOpen');
  });

  it('should toggle the sortGroupedNotificationsByProductAlphabetically checkbox when groupNotificationsByProduct is true', async () => {
    renderWithAppContext(<NotificationSettings />, {
      settingsStore: { groupNotificationsByProduct: true },
    });

    await userEvent.click(
      screen.getByLabelText('Sort product groups alphabetically'),
    );

    expect(toggleSettingSpy).toHaveBeenCalledTimes(1);
    expect(toggleSettingSpy).toHaveBeenCalledWith(
      'groupNotificationsByProductAlphabetically',
    );
  });

  it('should not toggle the sortGroupedNotificationsByProductAlphabetically checkbox when groupNotificationsByProduct is false', async () => {
    renderWithAppContext(<NotificationSettings />, {
      settingsStore: { groupNotificationsByProduct: false },
    });

    await userEvent.click(
      screen.getByLabelText('Sort product groups alphabetically'),
    );

    expect(toggleSettingSpy).toHaveBeenCalledTimes(0);
    expect(toggleSettingSpy).not.toHaveBeenCalledWith(
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
