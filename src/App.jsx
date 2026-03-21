import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import { mockApplications } from './data/mockApplications.js';
import AppRoutes from './routes/AppRoutes.jsx';

const getNowIso = () => new Date().toISOString();

const findById = (items, id) => items.find((item) => item.id === id);

const removeById = (items, id) => items.filter((item) => item.id !== id);

const buildDeletedArchiveEntry = (app) => ({
  ...app,
  previousStatus: app.status,
  deletedAt: getNowIso(),
  archiveReason: 'deleted',
});

const buildRestoredApp = (app) => ({
  ...app,
  status: app.previousStatus || app.status || 'Wishlist',
  updatedAt: getNowIso(),
});

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
    const target = findById(apps, appId);
    if (target) {
      const archiveEntry = buildDeletedArchiveEntry(target);
      setDeletedApps((prev) => [archiveEntry, ...prev]);
    }
    setApps((prev) => removeById(prev, appId));
  };

  const handleRestoreDeleted = (appId) => {
    const target = findById(deletedApps, appId);
    if (!target) return;

    const restoredApp = buildRestoredApp(target);
    setDeletedApps((prev) => removeById(prev, appId));
    setApps((prev) => {
      if (prev.some((item) => item.id === appId)) return prev;
      return [...prev, restoredApp];
    });
  };

  const handleRemoveDeleted = (appId) => {
    setDeletedApps((prev) => removeById(prev, appId));
  };

  const handleRestoreRejected = (appId) => {
    setApps((prev) => prev.map((item) => (
      item.id === appId
        ? { ...item, status: 'Applied', updatedAt: getNowIso() }
        : item
    )));
  };

  return (
    <Router>
      <AppRoutes
        isDarkMode={isDarkMode}
        onToggleTheme={onToggleTheme}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        apps={apps}
        setApps={setApps}
        deletedApps={deletedApps}
        onDeleteApplication={handleDeleteApplication}
        onRestoreDeleted={handleRestoreDeleted}
        onRemoveDeleted={handleRemoveDeleted}
        onRestoreRejected={handleRestoreRejected}
        isLoading={isLoading}
      />
    </Router>
  );
}

App.propTypes = {
  isDarkMode: PropTypes.bool.isRequired,
  onToggleTheme: PropTypes.func.isRequired,
};

export default App;

