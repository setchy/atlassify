import { describe, expect, it } from 'vitest';

import useNotificationsStore from './useNotificationsStore';

describe('renderer/stores/useNotificationsStore.ts', () => {
  it('should have the correct default state', () => {
    const {
      notificationCount,
      hasMoreAccountNotifications,
      isError,
      isOnline,
    } = useNotificationsStore.getState();

    expect(notificationCount).toBe(0);
    expect(hasMoreAccountNotifications).toBe(false);
    expect(isError).toBe(false);
    expect(isOnline).toBe(true);
  });

  it('should update notification status', () => {
    useNotificationsStore.getState().updateNotificationStatus(10, true, false);

    const { notificationCount, hasMoreAccountNotifications, isError } =
      useNotificationsStore.getState();

    expect(notificationCount).toBe(10);
    expect(hasMoreAccountNotifications).toBe(true);
    expect(isError).toBe(false);
  });

  it('should reflect error state', () => {
    useNotificationsStore.getState().updateNotificationStatus(0, false, true);

    expect(useNotificationsStore.getState().isError).toBe(true);
  });

  it('should update online status', () => {
    useNotificationsStore.getState().updateIsOnline(false);

    expect(useNotificationsStore.getState().isOnline).toBe(false);

    useNotificationsStore.getState().updateIsOnline(true);

    expect(useNotificationsStore.getState().isOnline).toBe(true);
  });
});
