import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/layout/Layout';
import JobApplications from './pages/JobApplications';
import Resumes from './pages/Resumes';
import Subscriptions from './pages/Subscriptions';
import Archive from './pages/Archive';
import Settings from './pages/Settings';
import { mockApplications } from './data/mockApplications.js';

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
              <JobApplications
                apps={apps}
                setApps={setApps}
                onDeleteApplication={handleDeleteApplication}
                searchQuery={searchQuery}
                isLoading={isLoading}
              />
            )}
          />
          <Route path="resumes" element={<Resumes />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route
            path="archive"
            element={(
              <Archive
                apps={apps}
                deletedApps={deletedApps}
                onRestoreDeleted={handleRestoreDeleted}
                onRemoveDeleted={handleRemoveDeleted}
                onRestoreRejected={handleRestoreRejected}
              />
            )}
          />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
