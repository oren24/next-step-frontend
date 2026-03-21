import { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/layout/Layout';
import { mockApplications } from './data/mockApplications.js';

const JobApplications = lazy(() => import('./pages/JobApplications'));
const Resumes = lazy(() => import('./pages/Resumes'));
const Subscriptions = lazy(() => import('./pages/Subscriptions'));
const Archive = lazy(() => import('./pages/Archive'));
const Settings = lazy(() => import('./pages/Settings'));

function App({ isDarkMode, onToggleTheme }) {
  const [isLoading, setIsLoading] = useState(true);
  const [apps, setApps] = useState(() => mockApplications.map((app) => ({ ...app })));
  const [deletedApps, setDeletedApps] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timeoutId = globalThis.setTimeout(() => {
      setIsLoading(false);
    }, 550);

    return () => {
      globalThis.clearTimeout(timeoutId);
    };
  }, []);

  const handleDeleteApplication = (appId) => {
    setApps((prev) => {
      const now = new Date().toISOString();
      const target = prev.find((item) => item.id === appId);
      if (target) {
        setDeletedApps((deletedPrev) => [
          {
            ...target,
            previousStatus: target.status,
            deletedAt: now,
            archiveReason: 'deleted',
          },
          ...deletedPrev,
        ]);
      }
      return prev.filter((item) => item.id !== appId);
    });
  };

  const handleRestoreDeleted = (appId) => {
    setDeletedApps((prev) => {
      const target = prev.find((item) => item.id === appId);
      if (!target) return prev;

      const restoredApp = {
        ...target,
        status: target.previousStatus || target.status || 'Wishlist',
        updatedAt: new Date().toISOString(),
      };

      setApps((appsPrev) => {
        if (appsPrev.some((item) => item.id === appId)) return appsPrev;
        return [...appsPrev, restoredApp];
      });

      return prev.filter((item) => item.id !== appId);
    });
  };

  const handleRemoveDeleted = (appId) => {
    setDeletedApps((prev) => prev.filter((item) => item.id !== appId));
  };

  const handleRestoreRejected = (appId) => {
    setApps((prev) => prev.map((item) => (
      item.id === appId
        ? { ...item, status: 'Applied', updatedAt: new Date().toISOString() }
        : item
    )));
  };

  const routeFallback = <div style={{ padding: 16 }}>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={(
            <Layout
              isDarkMode={isDarkMode}
              onToggleTheme={onToggleTheme}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          )}
        >
          <Route
            index
            element={(
              <Suspense fallback={routeFallback}>
                <JobApplications
                  apps={apps}
                  setApps={setApps}
                  onDeleteApplication={handleDeleteApplication}
                  searchQuery={searchQuery}
                  isLoading={isLoading}
                />
              </Suspense>
            )}
          />
          <Route
            path="resumes"
            element={(
              <Suspense fallback={routeFallback}>
                <Resumes />
              </Suspense>
            )}
          />
          <Route
            path="subscriptions"
            element={(
              <Suspense fallback={routeFallback}>
                <Subscriptions />
              </Suspense>
            )}
          />
          <Route
            path="archive"
            element={(
              <Suspense fallback={routeFallback}>
                <Archive
                  apps={apps}
                  deletedApps={deletedApps}
                  onRestoreDeleted={handleRestoreDeleted}
                  onRemoveDeleted={handleRemoveDeleted}
                  onRestoreRejected={handleRestoreRejected}
                />
              </Suspense>
            )}
          />
          <Route
            path="settings"
            element={(
              <Suspense fallback={routeFallback}>
                <Settings />
              </Suspense>
            )}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
