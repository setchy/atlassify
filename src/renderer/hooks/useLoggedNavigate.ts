import { useNavigate } from 'react-router-dom';

import { trackEvent } from '@aptabase/electron/renderer';

import { formatProperCase } from '../utils/helpers';

type NavigateArgs =
  | [to: string, options?: { replace?: boolean; state?: any }]
  | [delta: number];

/**
 * Wrapper around useNavigate that logs navigation events.
 * Usage: const navigate = useLoggedNavigate();
 */
export function useLoggedNavigate() {
  const navigate = useNavigate();

  return (...args: NavigateArgs) => {
    if (typeof args[0] === 'string') {
      const screen =
        args[0] === '/'
          ? 'Notifications'
          : formatProperCase(args[0].replaceAll('/', ''));
      trackEvent('navigate', { to: screen });
    }

    // @ts-expect-error: TypeScript can't infer overloads here, but runtime is correct
    return navigate(...args);
  };
}
