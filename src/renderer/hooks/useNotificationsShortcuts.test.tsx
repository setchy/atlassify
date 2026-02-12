import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

import { vi } from 'vitest';

import {
  mockAccountNotifications,
  mockAtlassifyNotifications,
} from '../__mocks__/notifications-mocks';

import useSettingsStore from '../stores/useSettingsStore';

import type { AccountNotifications, AtlassifyNotification } from '../types';

import * as links from '../utils/links';
import { shouldRemoveNotificationsFromState } from '../utils/notifications/remove';
import { useNotificationsShortcuts } from './useNotificationsShortcuts';

type TestHarnessProps = {
  initialNotifications: AccountNotifications[];
  markAsReadOnOpen?: boolean;
  onMarkRead?: (notifications: AtlassifyNotification[]) => void;
};

const cloneAccountNotifications = (
  notifications: AccountNotifications[],
): AccountNotifications[] =>
  notifications.map((account) => ({
    ...account,
    notifications: account.notifications.map((notification) => ({
      ...notification,
      notificationGroup: { ...notification.notificationGroup },
      actor: { ...notification.actor },
      entity: { ...notification.entity },
      product: { ...notification.product },
      account: { ...notification.account },
    })),
  }));

const TestHarness = ({
  initialNotifications,
  markAsReadOnOpen = false,
  onMarkRead,
}: TestHarnessProps) => {
  const [notifications, setNotifications] =
    useState<AccountNotifications[]>(initialNotifications);

  const markNotificationsRead = async (
    items: AtlassifyNotification[],
  ): Promise<void> => {
    onMarkRead?.(items);

    if (!shouldRemoveNotificationsFromState()) {
      return;
    }

    const idsToRemove = new Set(items.map((item) => item.id));
    setNotifications((prev) =>
      prev.map((account) => ({
        ...account,
        notifications: account.notifications.filter(
          (notification) => !idsToRemove.has(notification.id),
        ),
      })),
    );
  };

  const markNotificationsUnread = async (): Promise<void> => undefined;

  const { focusedNotificationId } = useNotificationsShortcuts({
    notifications,
    markAsReadOnOpen,
    markNotificationsRead,
    markNotificationsUnread,
  });

  return (
    <div>
      <div data-testid="focused-id">{focusedNotificationId ?? ''}</div>
      {notifications.flatMap((account) =>
        account.notifications.map((notification) => (
          <div
            data-notification-id={notification.id}
            data-notification-row="true"
            key={notification.id}
          >
            {notification.message}
          </div>
        )),
      )}
    </div>
  );
};

describe('useNotificationsShortcuts', () => {
  beforeAll(() => {
    Element.prototype.scrollIntoView = vi.fn();
  });

  beforeEach(() => {
    useSettingsStore.setState({
      fetchOnlyUnreadNotifications: false,
      delayNotificationState: false,
    });
  });

  it('moves focus with arrow keys', async () => {
    render(
      <TestHarness
        initialNotifications={cloneAccountNotifications(
          mockAccountNotifications,
        )}
      />,
    );

    await userEvent.keyboard('{ArrowDown}');

    expect(screen.getByTestId('focused-id')).toHaveTextContent(
      mockAtlassifyNotifications[0].id,
    );

    await userEvent.keyboard('{ArrowDown}');

    expect(screen.getByTestId('focused-id')).toHaveTextContent(
      mockAtlassifyNotifications[1].id,
    );

    await userEvent.keyboard('{ArrowUp}');

    expect(screen.getByTestId('focused-id')).toHaveTextContent(
      mockAtlassifyNotifications[0].id,
    );
  });

  it('opens focused notification on Enter and marks read on open', async () => {
    const openNotificationSpy = vi
      .spyOn(links, 'openNotification')
      .mockImplementation(vi.fn());
    const markReadSpy = vi.fn();

    render(
      <TestHarness
        initialNotifications={cloneAccountNotifications(
          mockAccountNotifications,
        )}
        markAsReadOnOpen
        onMarkRead={markReadSpy}
      />,
    );

    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{Enter}');

    expect(openNotificationSpy).toHaveBeenCalledWith(
      expect.objectContaining({ id: mockAtlassifyNotifications[0].id }),
    );
    expect(markReadSpy).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: mockAtlassifyNotifications[0].id }),
      ]),
    );
  });

  it('moves focus to next after removal on read toggle', async () => {
    useSettingsStore.setState({
      fetchOnlyUnreadNotifications: true,
      delayNotificationState: false,
    });

    render(
      <TestHarness
        initialNotifications={cloneAccountNotifications(
          mockAccountNotifications,
        )}
      />,
    );

    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('a');

    await waitFor(() => {
      expect(screen.getByTestId('focused-id')).toHaveTextContent(
        mockAtlassifyNotifications[1].id,
      );
    });
  });
});
