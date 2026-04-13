import { useCallback } from 'react';
import { INTERVIEWING_STATUS } from '../constants/boardConstants.js';
import {
  getCurrentTimestamp,
  updateAppStatus,
  withStatusHistoryEntry,
} from '../utils/statusHistoryUtils.js';

export const useJobApplicationActions = ({
  setApps,
  setSelectedApp,
  setIsDrawerOpen,
  onDeleteApplication,
}) => {
  const handleUpdateAppStatus = useCallback((appId, newStatus) => {
    setApps((prev) => prev.map((app) => (
      app.id === appId ? updateAppStatus(app, newStatus) : app
    )));
  }, [setApps]);

  const handleDeleteApplication = useCallback((appId) => {
    if (onDeleteApplication) {
      onDeleteApplication(appId);
      return;
    }

    setApps((prev) => prev.filter((app) => app.id !== appId));
  }, [onDeleteApplication, setApps]);

  const handleAddApplication = useCallback((newApp) => {
    setApps((prev) => [...prev, newApp]);
  }, [setApps]);

  const handleOpenJobDrawer = useCallback((app) => {
    if (!app) return;
    setSelectedApp(app);
    setIsDrawerOpen(true);
  }, [setIsDrawerOpen, setSelectedApp]);

  const handleCloseJobDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, [setIsDrawerOpen]);

  const handleSaveNote = useCallback((appId, note) => {
    const now = getCurrentTimestamp();

    setApps((prev) => prev.map((item) => (
      item.id === appId
        ? { ...item, note, notes: note, updatedAt: now }
        : item
    )));

    setSelectedApp((prev) => (
      prev && prev.id === appId
        ? { ...prev, note, notes: note, updatedAt: now }
        : prev
    ));
  }, [setApps, setSelectedApp]);

  const handleSaveInterviewStatus = useCallback((appId) => {
    const now = getCurrentTimestamp();

    setApps((prev) => prev.map((item) => {
      if (item.id !== appId) return item;
      const updated = { ...item, status: INTERVIEWING_STATUS, updatedAt: now };
      return withStatusHistoryEntry(updated, INTERVIEWING_STATUS, now);
    }));

    setSelectedApp((prev) => {
      if (!prev || prev.id !== appId) return prev;
      const updated = { ...prev, status: INTERVIEWING_STATUS, updatedAt: now };
      return withStatusHistoryEntry(updated, INTERVIEWING_STATUS, now);
    });
  }, [setApps, setSelectedApp]);

  const handleSaveEdit = useCallback((updatedApp) => {
    const now = getCurrentTimestamp();
    const savedApp = { ...updatedApp, updatedAt: now };

    setApps((prev) => prev.map((item) => (item.id === savedApp.id ? savedApp : item)));
    setSelectedApp((prev) => (prev && prev.id === savedApp.id ? savedApp : prev));
    setIsDrawerOpen(false);
  }, [setApps, setSelectedApp, setIsDrawerOpen]);

  return {
    handleUpdateAppStatus,
    handleDeleteApplication,
    handleAddApplication,
    handleOpenJobDrawer,
    handleCloseJobDrawer,
    handleSaveNote,
    handleSaveInterviewStatus,
    handleSaveEdit,
  };
};
