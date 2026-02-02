import { vi } from 'vitest';

import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAppContext } from '../../__helpers__/test-utils';

import { NotificationSettings } from './NotificationSettings';

describe('renderer/components/settings/NotificationSettings.tsx', () => {
  const updateSettingMock = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should toggle the markAsReadOnOpen checkbox', async () => {
    await act(async () => {
      renderWithAppContext(<NotificationSettings />, {
        updateSetting: updateSettingMock,
      });
    });

    await userEvent.click(screen.getByLabelText('Mark as read on open'));

    expect(updateSettingMock).toHaveBeenCalledTimes(1);
    expect(updateSettingMock).toHaveBeenCalledWith('markAsReadOnOpen', false);
  });

  it('should toggle the sortGroupedNotificationsByProductAlphabetically checkbox', async () => {
    await act(async () => {
      renderWithAppContext(<NotificationSettings />, {
        updateSetting: updateSettingMock,
      });
    });

    await userEvent.click(
      screen.getByLabelText('Group product notifications alphabetically'),
    );

    expect(updateSettingMock).toHaveBeenCalledTimes(1);
    expect(updateSettingMock).toHaveBeenCalledWith(
      'groupNotificationsByProductAlphabetically',
      true,
    );
  });

  it('should toggle the delayNotificationState checkbox', async () => {
    await act(async () => {
      renderWithAppContext(<NotificationSettings />, {
        updateSetting: updateSettingMock,
      });
    });

    await userEvent.click(screen.getByLabelText('Delay notification state'));

    expect(updateSettingMock).toHaveBeenCalledTimes(1);
    expect(updateSettingMock).toHaveBeenCalledWith(
      'delayNotificationState',
      true,
    );
  });
});
