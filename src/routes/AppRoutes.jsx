import { Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import { Route, Routes } from 'react-router-dom';
import Layout from '../components/layout/Layout';

const JobApplications = lazy(() => import('../pages/JobApplications'));
const Resumes = lazy(() => import('../pages/Resumes'));
const Subscriptions = lazy(() => import('../pages/Subscriptions'));
const Archive = lazy(() => import('../pages/Archive'));
const Settings = lazy(() => import('../pages/Settings'));

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
}) {
  return (
    <Routes>
      <Route
        path="/"
        element={(
          <Layout
            isDarkMode={isDarkMode}
            onToggleTheme={onToggleTheme}
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
          />
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
            />
          )}
        />
        <Route path="resumes" element={withRouteFallback(<Resumes />)} />
        <Route path="subscriptions" element={withRouteFallback(<Subscriptions />)} />
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
};

