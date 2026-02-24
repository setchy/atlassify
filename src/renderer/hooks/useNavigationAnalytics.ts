import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { trackEvent } from '../utils/comms';
import { formatProperCase } from '../utils/helpers';

/**
 * Hook to log navigation events on every location change.
 *
 * Tracks navigation to different screens for analytics purposes.
 * Screen name is derived from pathname, with '/' mapped to 'Notifications'.
 */
export function useNavigationAnalytics() {
  const location = useLocation();

  useEffect(() => {
    // Derive screen name from pathname; '/' is 'Notifications', others are proper-cased.
    const screen =
      location.pathname === '/'
        ? 'Notifications'
        : formatProperCase(location.pathname.replaceAll('/', ''));

    trackEvent('Navigate', { to: screen });
  }, [location]);
}
