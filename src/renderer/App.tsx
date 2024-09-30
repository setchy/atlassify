import { useContext } from 'react';
import {
  Navigate,
  Route,
  HashRouter as Router,
  Routes,
  useLocation,
} from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { AppContext, AppProvider } from './context/App';
import { AccountsRoute } from './routes/Accounts';
import { FiltersRoute } from './routes/Filters';
import { LandingRoute } from './routes/Landing';
import { LoginRoute } from './routes/Login';
import { NotificationsRoute } from './routes/Notifications';
import { SettingsRoute } from './routes/Settings';
import './App.css';

function RequireAuth({ children }) {
  const { isLoggedIn } = useContext(AppContext);
  const location = useLocation();

  return isLoggedIn ? (
    children
  ) : (
    <Navigate to="/landing" replace state={{ from: location }} />
  );
}

export const App = () => {
  return (
    <AppProvider>
      <Router>
        <div className="flex h-full overflow-y-auto flex-col pl-14">
          <Sidebar />
          <Routes>
            <Route
              path="/"
              element={
                <RequireAuth>
                  <NotificationsRoute />
                </RequireAuth>
              }
            />
            <Route
              path="/filters"
              element={
                <RequireAuth>
                  <FiltersRoute />
                </RequireAuth>
              }
            />
            <Route
              path="/settings"
              element={
                <RequireAuth>
                  <SettingsRoute />
                </RequireAuth>
              }
            />
            <Route
              path="/accounts"
              element={
                <RequireAuth>
                  <AccountsRoute />
                </RequireAuth>
              }
            />
            <Route path="/landing" element={<LandingRoute />} />
            <Route path="/login" element={<LoginRoute />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
};