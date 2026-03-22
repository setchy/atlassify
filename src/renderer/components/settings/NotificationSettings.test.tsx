import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '../../__helpers__/test-utils';

import { useSettingsStore } from '../../stores';

import { NotificationSettings } from './NotificationSettings';

describe('renderer/components/settings/NotificationSettings.tsx', () => {
  let toggleSettingSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    toggleSettingSpy = vi.spyOn(useSettingsStore.getState(), 'toggleSetting');
  });

  it('should toggle the markAsReadOnOpen checkbox', async () => {
    renderWithProviders(<NotificationSettings />, {
      settings: { markAsReadOnOpen: true },
    });

    await userEvent.click(screen.getByLabelText('Mark as read on open'));

    expect(toggleSettingSpy).toHaveBeenCalledTimes(1);
    expect(toggleSettingSpy).toHaveBeenCalledWith('markAsReadOnOpen');
  });

  it('should toggle the sortGroupedNotificationsAlphabetically checkbox when groupBy is "product"', async () => {
    renderWithProviders(<NotificationSettings />, {
      settings: { groupBy: 'product' },
    });

    await userEvent.click(
      screen.getByLabelText('Sort product groups alphabetically'),
    );

    expect(toggleSettingSpy).toHaveBeenCalledTimes(1);
    expect(toggleSettingSpy).toHaveBeenCalledWith(
      'sortGroupedNotificationsAlphabetically',
    );
  });

  it('should not toggle the sortGroupedNotificationsAlphabetically checkbox when groupNotificationsByProduct is false', async () => {
    renderWithProviders(<NotificationSettings />, {
      settings: { groupBy: 'none' },
    });

    await userEvent.click(
      screen.getByLabelText('Sort product groups alphabetically'),
    );

    expect(toggleSettingSpy).toHaveBeenCalledTimes(0);
    expect(toggleSettingSpy).not.toHaveBeenCalledWith(
      'sortGroupedNotificationsAlphabetically',
    );
  });

  it('should toggle the delayNotificationState checkbox', async () => {
    renderWithProviders(<NotificationSettings />);

    await userEvent.click(screen.getByLabelText('Delay notification state'));

    expect(toggleSettingSpy).toHaveBeenCalledTimes(1);
    expect(toggleSettingSpy).toHaveBeenCalledWith('delayNotificationState');
  });
});
