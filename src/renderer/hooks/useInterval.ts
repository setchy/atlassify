import { useEffect, useRef } from 'react';

// Thanks to https://overreacted.io/making-setinterval-declarative-with-react-hooks/
export const useInterval = (callback, delay: number): void => {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      // @ts-expect-error
      savedCallback.current();
    }

    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};
