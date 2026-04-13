import { useCallback, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import ViewToggleBar from '../components/layout/ViewToggleBar.jsx';
import ApplicationsListView from '../components/list/ApplicationsListView.jsx';
import JobDrawer from '../components/drawer/JobDrawer.jsx';
import { shareJobApplication } from '../components/cards/shareJob.js';
import { BOARD } from './styles/jobApplicationsStyles.js';
import BoardView from './job-applications/components/BoardView.jsx';
import { STATUS_ORDER } from './job-applications/constants/boardConstants.js';
import { useJobApplicationFilters } from './job-applications/hooks/useJobApplicationFilters.js';
import { useDebouncedSearch } from './job-applications/hooks/useDebouncedSearch.js';
import {
  useDragAndDropSensors,
  useDragEndHandler,
  useDragState,
} from './job-applications/hooks/useDragAndDrop.js';
import { useJobApplicationActions } from './job-applications/hooks/useJobApplicationActions.js';
import DeleteApplicationModal from '../components/popapmodals/DeleteApplicationModal.jsx';
import EditApplicationModal from '../components/popapmodals/EditApplicationModal.jsx';

export default function JobApplications({
  apps,
  setApps,
  onDeleteApplication,
  searchQuery = '',
  isLoading = false,
  onNotify,
}) {
  const location = useLocation();
  const draftIdFromNavigation = location.state?.openDraftId;
  const initialDraftToOpen = draftIdFromNavigation
    ? apps.find((app) => app.id === draftIdFromNavigation) || null
    : null;

  const [currentView, setCurrentView] = useState('kanban');
  const [selectedApp, setSelectedApp] = useState(initialDraftToOpen);
  const [isDrawerOpen, setIsDrawerOpen] = useState(Boolean(initialDraftToOpen));
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [modalApplication, setModalApplication] = useState(null);

  // Debounce search to avoid excessive filtering on every keystroke
  const debouncedQuery = useDebouncedSearch(searchQuery, 300);

  const { filteredApps, columns, normalizedQuery } = useJobApplicationFilters(
    apps,
    debouncedQuery,
    STATUS_ORDER
  );

  const sensors = useDragAndDropSensors();
  const { activeId, setActiveId, handleDragStart, handleDragCancel } = useDragState();
  const { handleDragEnd: applyDragEnd } = useDragEndHandler(setApps, STATUS_ORDER);

  const {
    handleUpdateAppStatus,
    handleDeleteApplication,
    handleAddApplication,
    handleOpenJobDrawer,
    handleCloseJobDrawer,
    handleSaveNote,
    handleSaveInterviewStatus,
    handleSaveEdit,
  } = useJobApplicationActions({
    setApps,
    setSelectedApp,
    setIsDrawerOpen,
    onDeleteApplication,
  });

  const handleDragEnd = useCallback((event) => {
    setActiveId(null);
    applyDragEnd(event);
  }, [applyDragEnd, setActiveId]);

  const handleViewChange = useCallback((view) => {
    setCurrentView(view);
  }, []);

  const handleShareApplication = useCallback(async (app) => {
    await shareJobApplication(app);
  }, []);

  const handleOpenDeleteModal = useCallback((app) => {
    if (!app) return;
    setModalApplication(app);
    setDeleteModalOpen(true);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setModalApplication(null);
  }, []);

  const handleConfirmDeleteModal = useCallback(async () => {
    if (!modalApplication) return;
    await handleDeleteApplication(modalApplication.id);
    setDeleteModalOpen(false);
    setModalApplication(null);
  }, [handleDeleteApplication, modalApplication]);

  const handleOpenEditModal = useCallback((app) => {
    if (!app) return;
    setModalApplication(app);
    setEditModalOpen(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setEditModalOpen(false);
    setModalApplication(null);
  }, []);

  const handleSaveEditModal = useCallback((updatedApp) => {
    handleSaveEdit(updatedApp);
    setEditModalOpen(false);
    setModalApplication(null);
  }, [handleSaveEdit]);

  return (
    <Box sx={BOARD.container}>
      <ViewToggleBar
        currentView={currentView}
        onViewChange={handleViewChange}
        applications={filteredApps}
        onNotify={onNotify}
      />

      {normalizedQuery && (
        <Typography sx={BOARD.searchResultLabel}>
          Showing {filteredApps.length} result{filteredApps.length === 1 ? '' : 's'} for "{searchQuery}"
        </Typography>
      )}

      {currentView === 'list' ? (
        <ApplicationsListView
          apps={filteredApps}
          onAdd={handleAddApplication}
          onEdit={handleOpenJobDrawer}
          onRequestDelete={handleOpenDeleteModal}
          onStatusChange={handleUpdateAppStatus}
          isLoading={isLoading}
        />
      ) : (
        <BoardView
          statusOrder={STATUS_ORDER}
          columns={columns}
          isLoading={isLoading}
          activeId={activeId}
          apps={apps}
          updateAppStatus={handleUpdateAppStatus}
          onOpen={handleOpenJobDrawer}
          onRequestEdit={handleOpenEditModal}
          onRequestDelete={handleOpenDeleteModal}
          onShare={handleShareApplication}
          onAdd={handleAddApplication}
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragCancel={handleDragCancel}
          onDragEnd={handleDragEnd}
        />
      )}

      <EditApplicationModal
        open={editModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveEditModal}
        application={modalApplication}
      />

      <DeleteApplicationModal
        open={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDeleteModal}
        application={modalApplication}
      />

      <JobDrawer
        open={isDrawerOpen}
        app={selectedApp}
        onClose={handleCloseJobDrawer}
        onSaveNote={handleSaveNote}
        onSaveInterviewStatus={handleSaveInterviewStatus}
        onSaveEdit={handleSaveEdit}
      />
    </Box>
  );
}