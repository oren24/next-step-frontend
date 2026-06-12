import { useCallback } from 'react';
import { INTERVIEWING_STATUS } from '../constants/boardConstants.js';
import {
  getCurrentTimestamp,
  updateAppStatus,
  withStatusHistoryEntry,
} from '../utils/statusHistoryUtils.js';
import { applicationsApi } from '../../../api/apiClient.js';

export const useJobApplicationActions = ({
  setApps,
  setSelectedApp,
  setIsDrawerOpen,
  onDeleteApplication,
  onNotify,
}) => {
  const handleUpdateAppStatus = useCallback(async (appId, newStatus) => {
    if (typeof appId === 'number') {
      try {
        await applicationsApi.update(appId, { status: newStatus.toLowerCase() });
      } catch (error) {
        if (onNotify) onNotify({ message: 'Failed to update status', severity: 'error' });
        return;
      }
    }

    setApps((prev) => prev.map((app) => (
      app.id === appId ? updateAppStatus(app, newStatus) : app
    )));
  }, [setApps, onNotify]);

  const handleDeleteApplication = useCallback(async (appId) => {
    if (onDeleteApplication) {
      await onDeleteApplication(appId);
      return;
    }

    if (typeof appId === 'number') {
      try {
        await applicationsApi.delete(appId);
      } catch (error) {
        if (onNotify) onNotify({ message: 'Failed to delete application', severity: 'error' });
        return;
      }
    }

    setApps((prev) => prev.filter((app) => app.id !== appId));
  }, [onDeleteApplication, setApps, onNotify]);

  const handleAddApplication = useCallback(async (newApp) => {
    try {
      const payload = {
        company_name: newApp.companyName,
        job_title: newApp.jobTitle,
        status: newApp.status ? newApp.status.toLowerCase() : 'wishlist',
        description: newApp.description,
        applied_date: newApp.appliedDate || undefined,
      };
      if (newApp.jobUrl && newApp.jobUrl.trim() !== '') {
        payload.job_url = newApp.jobUrl;
      }

      const response = await applicationsApi.create(payload);

      if (response.data) {
        const createdApp = {
          ...response.data,
          status: response.data.status ? response.data.status.charAt(0).toUpperCase() + response.data.status.slice(1) : 'Wishlist',
          companyName: response.data.company_name,
          jobTitle: response.data.job_title,
          jobUrl: response.data.job_url,
          companyLogo: response.data.company_logo,
          appliedDate: response.data.applied_date,
        };
        setApps((prev) => [...prev, createdApp]);
        if (onNotify) onNotify({ message: 'Application created', severity: 'success' });
      }
    } catch (error) {
      if (onNotify) onNotify({ message: 'Failed to create application', severity: 'error' });
    }
  }, [setApps, onNotify]);

  const handleOpenJobDrawer = useCallback((app) => {
    if (!app) return;
    setSelectedApp(app);
    setIsDrawerOpen(true);
  }, [setIsDrawerOpen, setSelectedApp]);

  const handleCloseJobDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, [setIsDrawerOpen]);

  const handleSaveNote = useCallback(async (appId, note) => {
    if (typeof appId === 'number') {
      try {
        await applicationsApi.update(appId, { description: note });
      } catch (error) {
        if (onNotify) onNotify({ message: 'Failed to save note', severity: 'error' });
        return;
      }
    }

    const now = getCurrentTimestamp();

    setApps((prev) => prev.map((item) => (
      item.id === appId
        ? { ...item, note, notes: note, description: note, updatedAt: now }
        : item
    )));

    setSelectedApp((prev) => (
      prev && prev.id === appId
        ? { ...prev, note, notes: note, description: note, updatedAt: now }
        : prev
    ));
  }, [setApps, setSelectedApp, onNotify]);

  const handleSaveInterviewStatus = useCallback(async (appId) => {
    if (typeof appId === 'number') {
      try {
        await applicationsApi.update(appId, { status: INTERVIEWING_STATUS.toLowerCase() });
      } catch (error) {
        if (onNotify) onNotify({ message: 'Failed to update interview status', severity: 'error' });
        return;
      }
    }

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
  }, [setApps, setSelectedApp, onNotify]);

  const handleSaveEdit = useCallback(async (updatedApp) => {
    if (typeof updatedApp.id === 'number') {
      try {
        const payload = {
          company_name: updatedApp.companyName,
          job_title: updatedApp.jobTitle,
          status: updatedApp.status ? updatedApp.status.toLowerCase() : 'wishlist',
          description: updatedApp.description,
          applied_date: updatedApp.appliedDate || undefined,
        };
        if (updatedApp.jobUrl && updatedApp.jobUrl.trim() !== '') {
          payload.job_url = updatedApp.jobUrl;
        }

        await applicationsApi.update(updatedApp.id, payload);
      } catch (error) {
        if (onNotify) onNotify({ message: 'Failed to save edits', severity: 'error' });
        return;
      }
    }

    const now = getCurrentTimestamp();
    const savedApp = { ...updatedApp, updatedAt: now };

    setApps((prev) => prev.map((item) => (item.id === savedApp.id ? savedApp : item)));
    setSelectedApp((prev) => (prev && prev.id === savedApp.id ? savedApp : prev));
    setIsDrawerOpen(false);
  }, [setApps, setSelectedApp, setIsDrawerOpen, onNotify]);

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
