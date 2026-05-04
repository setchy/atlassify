import { renderHook } from '@testing-library/react';

import { onlineManager } from '@tanstack/react-query';

import { useRuntimeStore } from '../stores';

import { useOnlineSync } from './useOnlineSync';

describe('renderer/hooks/useOnlineSync.ts', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    // Restore to online so other tests are not affected
    onlineManager.setOnline(true);
  });

  it('calls onlineManager.setOnline with navigator.onLine on mount', () => {
    const setOnlineSpy = vi.spyOn(onlineManager, 'setOnline');

    renderHook(() => useOnlineSync());

    expect(setOnlineSpy).toHaveBeenCalledWith(navigator.onLine);
  });

  it('updates the runtime store when onlineManager state changes', () => {
    renderHook(() => useOnlineSync());

    onlineManager.setOnline(false);
    expect(useRuntimeStore.getState().isOnline).toBe(false);

    onlineManager.setOnline(true);
    expect(useRuntimeStore.getState().isOnline).toBe(true);
  });

  it('unsubscribes from onlineManager on unmount', () => {
    const unsubscribeMock = vi.fn();
    vi.spyOn(onlineManager, 'subscribe').mockReturnValueOnce(unsubscribeMock);

    const { unmount } = renderHook(() => useOnlineSync());

    unmount();

    expect(unsubscribeMock).toHaveBeenCalledOnce();
  });

  it('re-syncs onlineManager with navigator.onLine on system wake', () => {
    const setOnlineSpy = vi.spyOn(onlineManager, 'setOnline');

    renderHook(() => useOnlineSync());

    setOnlineSpy.mockClear();

    // Simulate system wake event
    const wakeCallback = (
      window.atlassify.onSystemWake as ReturnType<typeof vi.fn>
    ).mock.calls[0][0];
    wakeCallback();

    expect(setOnlineSpy).toHaveBeenCalledWith(navigator.onLine);
  });
});
