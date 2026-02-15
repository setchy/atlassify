import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAppContext } from '../../__helpers__/test-utils';

import useSettingsStore from '../../stores/useSettingsStore';

import { NotificationSettings } from './NotificationSettings';

describe('renderer/components/settings/NotificationSettings.tsx', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should toggle the markAsReadOnOpen checkbox', async () => {
    useSettingsStore.setState({ markAsReadOnOpen: true });
    const updateSettingSpy = vi.spyOn(
      useSettingsStore.getState(),
      'updateSetting',
    );

    await act(async () => {
      renderWithAppContext(<NotificationSettings />);
    });

    await userEvent.click(screen.getByLabelText('Mark as read on open'));

    expect(updateSettingSpy).toHaveBeenCalledTimes(1);
    expect(updateSettingSpy).toHaveBeenCalledWith('markAsReadOnOpen', false);
  });

  it('should toggle the sortGroupedNotificationsByProductAlphabetically checkbox', async () => {
    const updateSettingSpy = vi.spyOn(
      useSettingsStore.getState(),
      'updateSetting',
    );

    await act(async () => {
      renderWithAppContext(<NotificationSettings />);
    });

    await userEvent.click(
      screen.getByLabelText('Group product notifications alphabetically'),
    );

    expect(updateSettingSpy).toHaveBeenCalledTimes(1);
    expect(updateSettingSpy).toHaveBeenCalledWith(
      'groupNotificationsByProductAlphabetically',
      true,
    );
  });

  it('should toggle the delayNotificationState checkbox', async () => {
    const updateSettingSpy = vi.spyOn(
      useSettingsStore.getState(),
      'updateSetting',
    );

    await act(async () => {
      renderWithAppContext(<NotificationSettings />);
    });

    await userEvent.click(screen.getByLabelText('Delay notification state'));

    expect(updateSettingSpy).toHaveBeenCalledTimes(1);
    expect(updateSettingSpy).toHaveBeenCalledWith(
      'delayNotificationState',
      true,
    );
  });
});
