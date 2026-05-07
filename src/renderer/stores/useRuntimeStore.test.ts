import useRuntimeStore from './useRuntimeStore';

describe('renderer/stores/useRuntimeStore.ts', () => {
  it('should have the correct default state', () => {
    const {
      notificationCount,
      hasMoreAccountNotifications,
      hasAnyAccountError,
      isOnline,
    } = useRuntimeStore.getState();

    expect(notificationCount).toBe(0);
    expect(hasMoreAccountNotifications).toBe(false);
    expect(hasAnyAccountError).toBe(false);
    expect(isOnline).toBe(true);
  });

  it('should update notification status', () => {
    useRuntimeStore.getState().updateNotificationStatus(10, true, true);

    const {
      notificationCount,
      hasMoreAccountNotifications,
      hasAnyAccountError,
    } = useRuntimeStore.getState();

    expect(notificationCount).toBe(10);
    expect(hasMoreAccountNotifications).toBe(true);
    expect(hasAnyAccountError).toBe(true);
  });

  it('should reflect hasAnyAccountError state', () => {
    useRuntimeStore.getState().updateNotificationStatus(0, false, true);

    expect(useRuntimeStore.getState().hasAnyAccountError).toBe(true);
  });

  it('should update online status', () => {
    useRuntimeStore.getState().updateIsOnline(false);

    expect(useRuntimeStore.getState().isOnline).toBe(false);

    useRuntimeStore.getState().updateIsOnline(true);

    expect(useRuntimeStore.getState().isOnline).toBe(true);
  });
});
