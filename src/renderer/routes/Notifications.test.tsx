import { vi } from 'vitest';

import { renderWithAppContext } from '../__helpers__/test-utils';
import { mockAccountNotifications } from '../__mocks__/notifications-mocks';

import { Errors } from '../utils/errors';
import { NotificationsRoute } from './Notifications';

vi.mock('../components/notifications/AccountNotifications', () => ({
  AccountNotifications: () => <p>AccountNotifications</p>,
}));

vi.mock('../components/AllRead', () => ({
  AllRead: () => <p>AllRead</p>,
}));

vi.mock('../components/Oops', () => ({
  Oops: () => <p>Oops</p>,
}));

describe('renderer/routes/Notifications.tsx', () => {
  it('should render itself & its children (with notifications)', () => {
    const tree = renderWithAppContext(<NotificationsRoute />, {
      allNotifications: mockAccountNotifications,
    });

    expect(tree).toMatchSnapshot();
  });

  it('should render itself & its children', () => {
    const tree = renderWithAppContext(<NotificationsRoute />, {
      allNotifications: [],
    });

    expect(tree).toMatchSnapshot();
  });

  describe('should render itself & its children (error conditions - oops)', () => {
    it('bad credentials', () => {
      const tree = renderWithAppContext(<NotificationsRoute />, {
        allNotifications: [],
        fetchStatus: 'error',
        globalError: Errors.BAD_CREDENTIALS,
      });

      expect(tree).toMatchSnapshot();
    });

    it('unknown error', () => {
      const tree = renderWithAppContext(<NotificationsRoute />, {
        allNotifications: [],
        fetchStatus: 'error',
        globalError: Errors.UNKNOWN,
      });

      expect(tree).toMatchSnapshot();
    });

    it('default error', () => {
      const tree = renderWithAppContext(<NotificationsRoute />, {
        allNotifications: [],
        fetchStatus: 'error',
        globalError: null,
      });

      expect(tree).toMatchSnapshot();
    });
  });
});
