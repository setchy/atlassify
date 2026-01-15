import { useContext } from 'react';
import {
  Navigate,
  Route,
  HashRouter as Router,
  Routes,
  useLocation,
} from 'react-router-dom';

import { AppContext, AppProvider } from './context/App';
import { AccountsRoute } from './routes/Accounts';
import { FiltersRoute } from './routes/Filters';
import { LandingRoute } from './routes/Landing';
import { LoginRoute } from './routes/Login';
import { NotificationsRoute } from './routes/Notifications';
import { SettingsRoute } from './routes/Settings';

import './App.css';

import { GlobalShortcuts } from './components/GlobalShortcuts';
import { AppLayout } from './components/layout/AppLayout';

function RequireAuth({ children }) {
  const { isLoggedIn } = useContext(AppContext);
  const location = useLocation();

  return isLoggedIn ? (
    children
  ) : (
    <Navigate replace state={{ from: location }} to="/landing" />
  );
}

export const App = () => {
  return (
    <AppProvider>
      <GlobalShortcuts />
      <Router>
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
  );
};
