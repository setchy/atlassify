import { type FC, useEffect } from 'react';
import {
  Navigate,
  Route,
  HashRouter as Router,
  Routes,
  useLocation,
} from 'react-router-dom';

import { QueryClientProvider } from '@tanstack/react-query';

import './App.css';

import { AppProvider } from './context/AppContext';
import { AccountsRoute } from './routes/Accounts';
import { FiltersRoute } from './routes/Filters';
import { LandingRoute } from './routes/Landing';
import { LoginRoute } from './routes/Login';
import { NotificationsRoute } from './routes/Notifications';
import { SettingsRoute } from './routes/Settings';
import { useAccountsStore } from './stores';
import { initializeStoreSubscriptions } from './stores/subscriptions';

import { AppRouterEffects } from './components/AppRouterEffects';
import { AppLayout } from './components/layout/AppLayout';

import { queryClient } from './utils/api/client';
import { migrateLegacyStoreToZustand } from './utils/core/storage';

// Run migration from legacy local storage to Zustand stores (async)
migrateLegacyStoreToZustand();

function RequireAuth({ children }) {
  const location = useLocation();

  const isLoggedIn = useAccountsStore((s) => s.isLoggedIn());

  return isLoggedIn ? (
    children
  ) : (
    <Navigate replace state={{ from: location }} to="/landing" />
  );
}

export const App: FC = () => {
  // Listen for system resume/wake and refetch all queries
  useEffect(() => {
    if (window.atlassify?.onSystemResume) {
      window.atlassify.onSystemResume(() => {
        queryClient.refetchQueries();
      });
    }
  }, []);

  // Initialize store subscriptions with proper cleanup
  useEffect(() => {
    const cleanup = initializeStoreSubscriptions();
    return cleanup;
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Router>
          <AppRouterEffects />
          <AppLayout>
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
