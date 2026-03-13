import { act, renderHook } from '@testing-library/react';

import { useIntervalTimer } from './useIntervalTimer';

describe('renderer/hooks/useIntervalTimer.ts', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calls the callback after the specified delay', () => {
    const callback = vi.fn();

    renderHook(() => useIntervalTimer({ callback, delay: 1000 }));

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('calls the callback on each subsequent interval tick', () => {
    const callback = vi.fn();

    renderHook(() => useIntervalTimer({ callback, delay: 1000 }));

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(callback).toHaveBeenCalledTimes(3);
  });

  it('clears the interval on unmount', () => {
    const callback = vi.fn();

    const { unmount } = renderHook(() =>
      useIntervalTimer({ callback, delay: 1000 }),
    );

    unmount();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it('always invokes the latest callback reference', () => {
    const first = vi.fn();
    const second = vi.fn();

    const { rerender } = renderHook(
      ({ cb }: { cb: () => void }) =>
        useIntervalTimer({ callback: cb, delay: 1000 }),
      { initialProps: { cb: first } },
    );

    rerender({ cb: second });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });
});
