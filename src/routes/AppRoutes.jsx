import { Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import { Route, Routes } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { ProtectedRoute, PublicOnlyRoute } from './ProtectedRoute.jsx';

const JobApplications = lazy(() => import('../pages/JobApplications'));
const Resumes = lazy(() => import('../pages/Resumes'));
const Subscriptions = lazy(() => import('../pages/Subscriptions'));
const Archive = lazy(() => import('../pages/Archive'));
const Drafts = lazy(() => import('../pages/Drafts'));
const Profile = lazy(() => import('../pages/Profile'));
const Settings = lazy(() => import('../pages/Settings'));
const SignIn = lazy(() => import('../pages/auth/SignIn'));
const SignUp = lazy(() => import('../pages/auth/SignUp'));

const withRouteFallback = (element) => (
  <Suspense fallback={<div style={{ padding: 16 }}>Loading...</div>}>
    {element}
  </Suspense>
);

export default function AppRoutes({
  isDarkMode,
  onToggleTheme,
  searchQuery,
  onSearchChange,
  apps,
  setApps,
  deletedApps,
  onDeleteApplication,
  onRestoreDeleted,
  onRemoveDeleted,
  onRestoreRejected,
  isLoading,
  onNotify,
}) {
  return (
    <Routes>
      <Route
        path="/auth/sign-in"
        element={withRouteFallback(
          <PublicOnlyRoute>
            <SignIn isDarkMode={isDarkMode} onToggleTheme={onToggleTheme} />
          </PublicOnlyRoute>
        )}
      />
      <Route
        path="/auth/sign-up"
        element={withRouteFallback(
          <PublicOnlyRoute>
            <SignUp isDarkMode={isDarkMode} onToggleTheme={onToggleTheme} />
          </PublicOnlyRoute>
        )}
      />
      <Route
        path="/"
        element={(
          <ProtectedRoute>
            <Layout
              isDarkMode={isDarkMode}
              onToggleTheme={onToggleTheme}
              searchQuery={searchQuery}
              onSearchChange={onSearchChange}
            />
          </ProtectedRoute>
        )}
      >
        <Route
          index
          element={withRouteFallback(
            <JobApplications
              apps={apps}
              setApps={setApps}
              onDeleteApplication={onDeleteApplication}
              searchQuery={searchQuery}
              isLoading={isLoading}
              onNotify={onNotify}
            />
          )}
        />
        <Route path="resumes" element={withRouteFallback(<Resumes />)} />
        <Route path="subscriptions" element={withRouteFallback(<Subscriptions />)} />
        <Route path="drafts" element={withRouteFallback(<Drafts apps={apps} />)} />
        <Route
          path="archive"
          element={withRouteFallback(
            <Archive
              apps={apps}
              deletedApps={deletedApps}
              onRestoreDeleted={onRestoreDeleted}
              onRemoveDeleted={onRemoveDeleted}
              onRestoreRejected={onRestoreRejected}
            />
          )}
        />
        <Route path="profile" element={withRouteFallback(<Profile />)} />
        <Route path="settings" element={withRouteFallback(<Settings />)} />
      </Route>
    </Routes>
  );
}

AppRoutes.propTypes = {
  isDarkMode: PropTypes.bool.isRequired,
  onToggleTheme: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  apps: PropTypes.array.isRequired,
  setApps: PropTypes.func.isRequired,
  deletedApps: PropTypes.array.isRequired,
  onDeleteApplication: PropTypes.func.isRequired,
  onRestoreDeleted: PropTypes.func.isRequired,
  onRemoveDeleted: PropTypes.func.isRequired,
  onRestoreRejected: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onNotify: PropTypes.func.isRequired,
};

