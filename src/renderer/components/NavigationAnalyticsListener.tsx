import { useNavigationAnalytics } from '../hooks/useNavigationAnalytics';

/**
 * Listens for navigation changes and logs analytics events.
 * Should be rendered inside <Router> but outside layout/content components.
 */
export function AppAnalytics() {
  useNavigationAnalytics();
  return null;
}
