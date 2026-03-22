import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthenticationContext, SessionContext } from '@toolpad/core/AppProvider';
import './App.css';
import { mockApplications } from './data/mockApplications.js';
import AppRoutes from './routes/AppRoutes.jsx';
import GlobalToast from './components/layout/GlobalToast.jsx';
import { useAuth } from './auth/useAuth.js';

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
  const { toolpadAuthentication, toolpadSession } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [apps, setApps] = useState(() => mockApplications.map((app) => ({ ...app })));
  const [deletedApps, setDeletedApps] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const showToast = ({ message, severity = 'success' }) => {
    setToast({
      open: true,
      message,
      severity,
    });
  };

  const closeToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

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
      showToast({
        message: `${target.companyName || target.company || 'Application'} moved to archive`,
        severity: 'warning',
      });
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

    showToast({
      message: `${target.companyName || target.company || 'Application'} restored`,
      severity: 'success',
    });
  };

  const handleRemoveDeleted = (appId) => {
    const target = findById(deletedApps, appId);
    setDeletedApps((prev) => removeById(prev, appId));
    if (target) {
      showToast({
        message: `${target.companyName || target.company || 'Application'} removed permanently`,
        severity: 'error',
      });
    }
  };

  const handleRestoreRejected = (appId) => {
    const target = findById(apps, appId);
    setApps((prev) => prev.map((item) => (
      item.id === appId
        ? { ...item, status: 'Applied', updatedAt: getNowIso() }
        : item
    )));

    if (target) {
      showToast({
        message: `${target.companyName || target.company || 'Application'} moved to Applied`,
        severity: 'success',
      });
    }
  };

  return (
    <Router>
      <AuthenticationContext.Provider value={toolpadAuthentication}>
        <SessionContext.Provider value={toolpadSession}>
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
            onNotify={showToast}
          />
          <GlobalToast
            open={toast.open}
            message={toast.message}
            severity={toast.severity}
            onClose={closeToast}
          />
        </SessionContext.Provider>
      </AuthenticationContext.Provider>
    </Router>
  );
}

App.propTypes = {
  isDarkMode: PropTypes.bool.isRequired,
  onToggleTheme: PropTypes.func.isRequired,
};

export default App;

