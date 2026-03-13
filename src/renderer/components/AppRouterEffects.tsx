import { GlobalShortcuts } from './GlobalShortcuts';
import { NavigationAnalyticsListener } from './NavigationAnalyticsListener';

/**
 * Mounts all router-scoped side-effect components in one place.
 * Must be rendered inside <Router> (needs location/navigation context)
 * but outside layout/content components so they apply to every route.
 *
 * Add new router-bound hooks here rather than scattering them across the tree.
 */
export function AppRouterEffects() {
  return (
    <>
      <NavigationAnalyticsListener />
      <GlobalShortcuts />
    </>
  );
}
