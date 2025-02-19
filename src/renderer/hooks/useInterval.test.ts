import { act, renderHook } from '@testing-library/react';
import { Constants } from '../utils/constants';
import { useInterval } from './useInterval'; // Adjust the path if necessary

const delay = Constants.FETCH_NOTIFICATIONS_INTERVAL;

describe('renderer/hooks/useInterval.ts', () => {
  const mockCallback = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.resetAllMocks();
  });

  it('should call the callback at the specified interval', () => {
    renderHook(() => useInterval(mockCallback, delay));

    act(() => {
      vi.advanceTimersByTime(delay);
    });

    expect(mockCallback).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(delay);
    });

    expect(mockCallback).toHaveBeenCalledTimes(2);
  });

  it('should not call the callback if delay is null', () => {
    renderHook(() => useInterval(mockCallback, null));

    act(() => {
      vi.advanceTimersByTime(delay);
    });

    expect(mockCallback).toHaveBeenCalledTimes(0);
  });
});
