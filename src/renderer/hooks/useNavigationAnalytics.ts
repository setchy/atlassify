import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { trackEvent } from '../utils/comms';
import { formatProperCase } from '../utils/helpers';

/**
 * Hook to log navigation events on every location change.
 */
export function useNavigationAnalytics() {
  const location = useLocation();

  useEffect(() => {
    const screen =
      location.pathname === '/'
        ? 'Notifications'
        : formatProperCase(location.pathname.replaceAll('/', ''));

    trackEvent('navigate', { to: screen });
  }, [location]);
}
