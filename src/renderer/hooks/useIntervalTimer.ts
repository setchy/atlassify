import { useEffect, useRef } from 'react';

interface UseIntervalTimerOptions {
  /** Function to call on each interval tick. Always uses the latest reference. */
  callback: () => void;
  /** Interval duration in milliseconds. */
  delay: number;
}

/**
 * Hook that triggers a callback on a recurring interval.
 * The interval is kept alive regardless of document visibility, making it suitable
 * for Electron tray apps where the window is hidden most of the time.
 *
 * Thanks to https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 *
 * @param callback - Function to call on each interval tick. Always uses the latest reference.
 * @param delay - Interval duration in milliseconds. Pass `null` to disable.
 */
export const useIntervalTimer = ({
  callback,
  delay,
}: UseIntervalTimerOptions) => {
  const savedCallback = useRef<(() => void) | null>(null);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};
