import { type FC, useEffect } from 'react';
import {
  Navigate,
  Route,
  HashRouter as Router,
  Routes,
  useLocation,
} from 'react-router-dom';

import { AppProvider } from './context/App';
import { AccountsRoute } from './routes/Accounts';
import { FiltersRoute } from './routes/Filters';
import { LandingRoute } from './routes/Landing';
import { LoginRoute } from './routes/Login';
import { NotificationsRoute } from './routes/Notifications';
import { SettingsRoute } from './routes/Settings';

import './App.css';

import { QueryClientProvider } from '@tanstack/react-query';

import { initializeStoreSubscriptions } from './stores/subscriptions';
import useAccountsStore from './stores/useAccountsStore';

import { GlobalShortcuts } from './components/GlobalShortcuts';
import { AppLayout } from './components/layout/AppLayout';
import { AppAnalytics } from './components/NavigationAnalyticsListener';

import { queryClient } from './utils/api/client';
import { rendererLogError } from './utils/logger';
import { migrateContextToZustand } from './utils/storage';

// Run migration from Context storage to Zustand stores (async)
migrateContextToZustand().catch((error) => {
  rendererLogError('App', 'Failed to migrate storage', error);
});

function RequireAuth({ children }) {
  const isLoggedIn = useAccountsStore((s) => s.isLoggedIn());
  const location = useLocation();

  return isLoggedIn ? (
    children
  ) : (
    <Navigate replace state={{ from: location }} to="/landing" />
  );
}

export const App: FC = () => {
  // Initialize store subscriptions with proper cleanup
  useEffect(() => {
    const cleanup = initializeStoreSubscriptions();
    return cleanup;
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Router>
          <AppAnalytics />
          <AppLayout>
            <GlobalShortcuts />
            <Routes>
              <Route
                element={
                  <RequireAuth>
                    <NotificationsRoute />
                  </RequireAuth>
                }
                path="/"
              />
              <Route
                element={
                  <RequireAuth>
                    <FiltersRoute />
                  </RequireAuth>
                }
                path="/filters"
              />
              <Route
                element={
                  <RequireAuth>
                    <SettingsRoute />
                  </RequireAuth>
                }
                path="/settings"
              />
              <Route
                element={
                  <RequireAuth>
                    <AccountsRoute />
                  </RequireAuth>
                }
                path="/accounts"
              />
              <Route element={<LandingRoute />} path="/landing" />
              <Route element={<LoginRoute />} path="/login" />
            </Routes>
          </AppLayout>
        </Router>
      </AppProvider>
    </QueryClientProvider>
  );
};
