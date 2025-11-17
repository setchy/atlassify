import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAppContext } from '../../__helpers__/test-utils';
import { NotificationSettings } from './NotificationSettings';

describe('renderer/components/settings/NotificationSettings.tsx', () => {
  const updateSetting = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should toggle the markAsReadOnOpen checkbox', async () => {
    await act(async () => {
      renderWithAppContext(<NotificationSettings />, {
        updateSetting,
      });
    });

    await userEvent.click(screen.getByLabelText('Mark as read on open'));

    expect(updateSetting).toHaveBeenCalledTimes(1);
    expect(updateSetting).toHaveBeenCalledWith('markAsReadOnOpen', false);
  });

  it('should toggle the sortGroupedNotificationsByProductAlphabetically checkbox', async () => {
    await act(async () => {
      renderWithAppContext(<NotificationSettings />, {
        updateSetting,
      });
    });

    await userEvent.click(
      screen.getByLabelText('Group product notifications alphabetically'),
    );

    expect(updateSetting).toHaveBeenCalledTimes(1);
    expect(updateSetting).toHaveBeenCalledWith(
      'groupNotificationsByProductAlphabetically',
      true,
    );
  });

  it('should toggle the delayNotificationState checkbox', async () => {
    await act(async () => {
      renderWithAppContext(<NotificationSettings />, {
        updateSetting,
      });
    });

    await userEvent.click(screen.getByLabelText('Delay notification state'));

    expect(updateSetting).toHaveBeenCalledTimes(1);
    expect(updateSetting).toHaveBeenCalledWith('delayNotificationState', true);
  });
});
