import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthenticationContext, SessionContext } from '@toolpad/core/AppProvider';
import './App.css';
import { mockApplications } from './data/mockApplications.js';
import { mockCompanies } from './data/mockCompanies.js';
import AppRoutes from './routes/AppRoutes.jsx';
import GlobalToast from './components/layout/GlobalToast.jsx';
import { useAuth } from './auth/useAuth.js';
import { applicationsApi } from './api/apiClient.js';

// Utility functions for app state management
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

const getStoredDeletedApps = (userId) => {
  try {
    const data = localStorage.getItem(`nextstep_deleted_apps_${userId}`);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
};

const setStoredDeletedApps = (userId, apps) => {
  if (!userId) return;
  localStorage.setItem(`nextstep_deleted_apps_${userId}`, JSON.stringify(apps));
};

function App({ isDarkMode, onToggleTheme }) {
  const { toolpadAuthentication, toolpadSession } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [apps, setApps] = useState([]);
  const [deletedApps, setDeletedApps] = useState([]);
  const [isInitializing, setIsInitializing] = useState(true);
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

  useEffect(() => {
    const fetchApps = async () => {
      const userId = toolpadSession?.user?.id;
      if (!userId) {
        setApps([]);
        setDeletedApps([]);
        setIsInitializing(false);
        return;
      }

      const storedDeleted = getStoredDeletedApps(userId);
      setDeletedApps(storedDeleted || []);

      try {
        const response = await applicationsApi.getAll();
        let loadedApps = response.data || [];
        
        // Map backend snake_case to frontend camelCase
        loadedApps = loadedApps.map(app => ({
          ...app,
          companyName: app.company_name,
          jobTitle: app.job_title,
          jobUrl: app.job_url,
          companyLogo: app.company_logo,
          appliedDate: app.applied_date
        }));

        if (loadedApps.length === 0 && toolpadSession?.user?.authProvider === 'github') {
          const demoApps = mockApplications.map((app) => {
            const company = mockCompanies.find(c => c.name === app.companyName);
            return { ...app, companyLogo: company?.companyLogo || app.companyLogo };
          });
          setApps(demoApps);
        } else {
          setApps(loadedApps);
        }
      } catch (error) {
        console.error('Failed to fetch applications', error);
      } finally {
        setIsInitializing(false);
      }
    };

    fetchApps();
  }, [toolpadSession?.user?.id, toolpadSession?.user?.authProvider]);

  useEffect(() => {
    const userId = toolpadSession?.user?.id;
    if (userId && !isInitializing) {
      setStoredDeletedApps(userId, deletedApps);
    }
  }, [deletedApps, toolpadSession?.user?.id, isInitializing]);

  const getAppLabel = (app) => app?.companyName || app?.company || 'Application';

  const handleDeleteApplication = async (appId) => {
    const target = findById(apps, appId);
    
    // We only delete from backend if it's a numeric ID (not a mock demo ID)
    if (typeof appId === 'number') {
      try {
        await applicationsApi.delete(appId);
      } catch (error) {
        showToast({ message: 'Failed to delete from database', severity: 'error' });
        return;
      }
    }

    if (target) {
      const archiveEntry = buildDeletedArchiveEntry(target);
      setDeletedApps((prev) => [archiveEntry, ...prev]);
      showToast({
        message: `${getAppLabel(target)} moved to archive`,
        severity: 'warning',
      });
    }
    setApps((prev) => removeById(prev, appId));
  };

  const handleRestoreDeleted = async (appId) => {
    const target = findById(deletedApps, appId);
    if (!target) return;

    // We do not re-create it in the backend automatically here to keep it simple, 
    // but the state will be restored to the UI.
    const restoredApp = buildRestoredApp(target);
    setDeletedApps((prev) => removeById(prev, appId));
    setApps((prev) => (prev.some((item) => item.id === appId) ? prev : [...prev, restoredApp]));

    showToast({
      message: `${getAppLabel(target)} restored`,
      severity: 'success',
    });
  };

  const handleRemoveDeleted = (appId) => {
    const target = findById(deletedApps, appId);
    setDeletedApps((prev) => removeById(prev, appId));
    if (target) {
      showToast({
        message: `${getAppLabel(target)} removed permanently`,
        severity: 'error',
      });
    }
  };

  const handleRestoreRejected = async (appId) => {
    const target = findById(apps, appId);
    
    if (typeof appId === 'number') {
      try {
        await applicationsApi.update(appId, { status: 'Applied' });
      } catch (error) {
        showToast({ message: 'Failed to update database', severity: 'error' });
        return;
      }
    }

    setApps((prev) => prev.map((item) => (
      item.id === appId
        ? { ...item, status: 'Applied', updatedAt: getNowIso() }
        : item
    )));

    if (target) {
      showToast({
        message: `${getAppLabel(target)} moved to Applied`,
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
