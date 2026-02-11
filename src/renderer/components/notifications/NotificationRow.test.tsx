import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { vi } from 'vitest';

import { renderWithAppContext } from '../../__helpers__/test-utils';
import { mockSingleAtlassifyNotification } from '../../__mocks__/notifications-mocks';

import useSettingsStore from '../../stores/useSettingsStore';

import type { ReadStateType } from '../../types';

import * as comms from '../../utils/comms';
import * as links from '../../utils/links';
import { PRODUCTS } from '../../utils/products';
import { NotificationRow, type NotificationRowProps } from './NotificationRow';

describe('renderer/components/notifications/NotificationRow.tsx', () => {
  vi.spyOn(links, 'openNotification').mockImplementation(vi.fn());
  vi.spyOn(comms, 'openExternalLink').mockImplementation(vi.fn());
  vi.spyOn(globalThis.Date, 'now').mockImplementation(() =>
    new Date('2024').valueOf(),
  );

  afterEach(() => {
    vi.clearAllMocks();
    useSettingsStore.getState().reset();
  });

  describe('should render notifications', () => {
    it('standard notification', async () => {
      const props: NotificationRowProps = {
        notification: mockSingleAtlassifyNotification,
        isProductAnimatingExit: false,
      };

      const tree = renderWithAppContext(<NotificationRow {...props} />);

      expect(tree).toMatchSnapshot();
    });

    it('group by title', async () => {
      useSettingsStore.setState({ groupNotificationsByTitle: true });

      const props: NotificationRowProps = {
        notification: mockSingleAtlassifyNotification,
        isProductAnimatingExit: false,
      };

      const tree = renderWithAppContext(<NotificationRow {...props} />);

      expect(tree).toMatchSnapshot();
    });

    it('group by title with multiple named actors', async () => {
      const mockNotification = mockSingleAtlassifyNotification;
      mockNotification.notificationGroup.size = 3;
      mockNotification.notificationGroup.additionalActors = [
        { displayName: 'User 1', avatarURL: null },
        { displayName: 'User 2', avatarURL: null },
      ];

      const props: NotificationRowProps = {
        notification: mockNotification,
        isProductAnimatingExit: false,
      };

      useSettingsStore.setState({ groupNotificationsByProduct: true });

      const tree = renderWithAppContext(<NotificationRow {...props} />);

      expect(tree).toMatchSnapshot();
    });

    it('group by title with multiple unnamed actors', async () => {
      const mockNotification = mockSingleAtlassifyNotification;
      mockNotification.notificationGroup.size = 3;
      mockNotification.notificationGroup.additionalActors = [];

      const props: NotificationRowProps = {
        notification: mockNotification,
        isProductAnimatingExit: false,
      };

      useSettingsStore.setState({ groupNotificationsByTitle: true });

      const tree = renderWithAppContext(<NotificationRow {...props} />);

      expect(tree).toMatchSnapshot();
    });

    it('compass avatar as square', async () => {
      const props: NotificationRowProps = {
        notification: {
          ...mockSingleAtlassifyNotification,
          product: PRODUCTS.compass,
          message: 'some-project improved a scorecard',
        },
        isProductAnimatingExit: false,
      };

      useSettingsStore.setState({ groupNotificationsByProduct: true });

      const tree = renderWithAppContext(<NotificationRow {...props} />);

      expect(tree).toMatchSnapshot();
    });

    it('missing entity icon url should default to product logo', async () => {
      const props: NotificationRowProps = {
        notification: {
          ...mockSingleAtlassifyNotification,
          entity: {
            ...mockSingleAtlassifyNotification.entity,
            iconUrl: null,
          },
        },
        isProductAnimatingExit: false,
      };

      useSettingsStore.setState({ groupNotificationsByProduct: true });

      const tree = renderWithAppContext(<NotificationRow {...props} />);

      expect(tree).toMatchSnapshot();
    });
  });

  describe('notification interactions', () => {
    it('should open a notification in the browser - click', async () => {
      const markNotificationsReadMock = vi.fn();

      const props: NotificationRowProps = {
        notification: mockSingleAtlassifyNotification,
        isProductAnimatingExit: false,
      };

      renderWithAppContext(<NotificationRow {...props} />, {
        markNotificationsRead: markNotificationsReadMock,
      });

      await userEvent.click(screen.getByTestId('notification-details'));

      expect(links.openNotification).toHaveBeenCalledTimes(1);
      expect(markNotificationsReadMock).toHaveBeenCalledTimes(1);
    });

    it('should open a notification in the browser - delay notification setting enabled', async () => {
      const markNotificationsReadMock = vi.fn();

      useSettingsStore.setState({ delayNotificationState: true });

      const props: NotificationRowProps = {
        notification: mockSingleAtlassifyNotification,
        isProductAnimatingExit: false,
      };

      renderWithAppContext(<NotificationRow {...props} />, {
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

      renderWithAppContext(<NotificationRow {...props} />, {
        markNotificationsRead: markNotificationsReadMock,
      });

      await userEvent.click(screen.getByTestId('notification-mark-as-read'));

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

      renderWithAppContext(<NotificationRow {...props} />, {
        markNotificationsUnread: markNotificationsUnreadMock,
      });

      await userEvent.click(screen.getByTestId('notification-mark-as-unread'));

      expect(markNotificationsUnreadMock).toHaveBeenCalledTimes(1);
    });
  });
});
