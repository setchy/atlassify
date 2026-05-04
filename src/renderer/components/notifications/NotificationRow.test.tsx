import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '../../__helpers__/test-utils';
import { mockSingleAtlassifyNotification } from '../../__mocks__/notifications-mocks';

import type { ReadStateType } from '../../types';

import * as comms from '../../utils/system/comms';
import * as links from '../../utils/system/links';
import { NotificationRow, type NotificationRowProps } from './NotificationRow';

describe('renderer/components/notifications/NotificationRow.tsx', () => {
  vi.spyOn(links, 'openNotification').mockImplementation(vi.fn());
  vi.spyOn(comms, 'openExternalLink').mockImplementation(vi.fn());
  vi.spyOn(globalThis.Date, 'now').mockImplementation(() =>
    new Date('2024').valueOf(),
  );

  describe('should render notifications', () => {
    it('standard notification', async () => {
      const props: NotificationRowProps = {
        notification: mockSingleAtlassifyNotification,
        isProductAnimatingExit: false,
      };

      const tree = renderWithProviders(<NotificationRow {...props} />);

      expect(tree.container).toMatchSnapshot();
    });

    it('group by title', async () => {
      const props: NotificationRowProps = {
        notification: mockSingleAtlassifyNotification,
        isProductAnimatingExit: false,
      };

      const tree = renderWithProviders(<NotificationRow {...props} />, {
        settings: { groupNotificationsByTitle: true },
      });

      expect(tree.container).toMatchSnapshot();
    });
  });

  describe('notification interactions', () => {
    it('should open a notification in the browser - click', async () => {
      const markNotificationsReadMock = vi.fn();

      const props: NotificationRowProps = {
        notification: mockSingleAtlassifyNotification,
        isProductAnimatingExit: false,
      };

      renderWithProviders(<NotificationRow {...props} />, {
        markNotificationsRead: markNotificationsReadMock,
      });

      // Get notification row element reference before clicking
      const notificationElement = screen
        .getByTestId('notification-details')
        .closest('[data-notification-row="true"]');

      await userEvent.click(screen.getByTestId('notification-details'));

      // Trigger transitionEnd to complete the animation and execute mutation
      await act(async () => {
        notificationElement?.dispatchEvent(
          new Event('transitionend', { bubbles: true }),
        );
      });

      expect(links.openNotification).toHaveBeenCalledTimes(1);
      expect(markNotificationsReadMock).toHaveBeenCalledTimes(1);
    });

    it('should open a notification in the browser - delay notification setting enabled', async () => {
      const markNotificationsReadMock = vi.fn();

      const props: NotificationRowProps = {
        notification: mockSingleAtlassifyNotification,
        isProductAnimatingExit: false,
      };

      renderWithProviders(<NotificationRow {...props} />, {
        settings: { delayNotificationState: true },
        markNotificationsRead: markNotificationsReadMock,
      });

      await userEvent.click(screen.getByTestId('notification-details'));

      expect(links.openNotification).toHaveBeenCalledTimes(1);
      expect(markNotificationsReadMock).toHaveBeenCalledTimes(1);
    });

    it('should mark a notification as read', async () => {
      const markNotificationsReadMock = vi.fn();

      const props: NotificationRowProps = {
        notification: mockSingleAtlassifyNotification,
        isProductAnimatingExit: false,
      };

      renderWithProviders(<NotificationRow {...props} />, {
        markNotificationsRead: markNotificationsReadMock,
      });

      // Get notification row element reference before clicking (button will be removed after click)
      const notificationElement = screen
        .getByTestId('notification-mark-as-read')
        .closest('[data-notification-row="true"]');

      await userEvent.click(screen.getByTestId('notification-mark-as-read'));

      // Trigger transitionEnd to complete the animation and execute mutation
      await act(async () => {
        notificationElement?.dispatchEvent(
          new Event('transitionend', { bubbles: true }),
        );
      });

      expect(markNotificationsReadMock).toHaveBeenCalledTimes(1);
    });

    it('should mark a notification as unread', async () => {
      const markNotificationsUnreadMock = vi.fn();

      const props: NotificationRowProps = {
        notification: {
          ...mockSingleAtlassifyNotification,
          readState: 'read' as ReadStateType,
        },
        isProductAnimatingExit: false,
      };

      renderWithProviders(<NotificationRow {...props} />, {
        markNotificationsUnread: markNotificationsUnreadMock,
      });

      await userEvent.click(screen.getByTestId('notification-mark-as-unread'));

      expect(markNotificationsUnreadMock).toHaveBeenCalledTimes(1);
    });
  });
});
