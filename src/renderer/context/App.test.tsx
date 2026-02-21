import { act } from '@testing-library/react';

import { renderWithAppContext } from '../__helpers__/test-utils';
import { mockSingleAtlassifyNotification } from '../__mocks__/notifications-mocks';

import { useAppContext } from '../hooks/useAppContext';
import { useNotifications } from '../hooks/useNotifications';

import * as notifications from '../utils/notifications/notifications';
import { type AppContextState, AppProvider } from './App';

vi.mock('../hooks/useNotifications');

// Helper to render the context
const renderWithContext = () => {
  let context!: AppContextState;

  const CaptureContext = () => {
    context = useAppContext();
    return null;
  };

  renderWithAppContext(
    <AppProvider>
      <CaptureContext />
    </AppProvider>,
  );

  return () => context;
};

describe('renderer/context/App.tsx', () => {
  const refetchNotificationsMock = vi.fn();
  const markNotificationsReadMock = vi.fn();
  const markNotificationsUnreadMock = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(useNotifications).mockReturnValue({
      status: 'success',
      globalError: null,
      notifications: [],
      notificationCount: 0,
      hasNotifications: false,
      hasMoreAccountNotifications: false,
      refetchNotifications: refetchNotificationsMock,
      markNotificationsRead: markNotificationsReadMock,
      markNotificationsUnread: markNotificationsUnreadMock,
    } as ReturnType<typeof useNotifications>);
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.clearAllMocks();
  });

  describe('notification methods', () => {
    const getNotificationCountSpy = vi.spyOn(
      notifications,
      'getNotificationCount',
    );
    getNotificationCountSpy.mockReturnValue(1);

    it('should call fetchNotifications', async () => {
      const getContext = renderWithContext();
      refetchNotificationsMock.mockReset();

      await act(async () => {
        await getContext().fetchNotifications();
      });

      expect(refetchNotificationsMock).toHaveBeenCalledTimes(1);
    });

    it('should call markNotificationsRead', async () => {
      const getContext = renderWithContext();

      act(() => {
        getContext().markNotificationsRead([mockSingleAtlassifyNotification]);
      });

      expect(markNotificationsReadMock).toHaveBeenCalledTimes(1);
      expect(markNotificationsReadMock).toHaveBeenCalledWith([
        mockSingleAtlassifyNotification,
      ]);
    });

    it('should call markNotificationsUnread', async () => {
      const getContext = renderWithContext();

      act(() => {
        getContext().markNotificationsUnread([mockSingleAtlassifyNotification]);
      });

      expect(markNotificationsUnreadMock).toHaveBeenCalledTimes(1);
      expect(markNotificationsUnreadMock).toHaveBeenCalledWith([
        mockSingleAtlassifyNotification,
      ]);
    });
  });
});
