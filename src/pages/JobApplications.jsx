import React, {useMemo, useState} from 'react';
import {Box, Paper, Skeleton, Stack, Typography} from '@mui/material';
import {DndContext, useDroppable, DragOverlay, useSensor, useSensors, PointerSensor, TouchSensor} from '@dnd-kit/core';
import {rectSortingStrategy, SortableContext} from '@dnd-kit/sortable';
import DraggableItem from '../components/cards/DraggableItem.jsx';
import ApplicationCard from '../components/cards/ApplicationCard.jsx';
import AddApplicationModal from '../components/popapmodals/AddApplicationModal.jsx';
import ViewToggleBar from '../components/layout/ViewToggleBar.jsx';
import ApplicationsListView from '../components/list/ApplicationsListView.jsx';
import {JOB_STATUSES} from '../constants/jobStatuses.js';
import JobDrawer from '../components/drawer/JobDrawer.jsx';
import { shareJobApplication } from '../components/cards/shareJob.js';
import {BOARD, STATUS_COLORS, EMPTY_STATE_GRADIENTS} from './styles/jobApplicationsStyles';

const STATUS_ORDER = JOB_STATUSES;
const INTERVIEWING_STATUS = 'Interviewing';
const NOOP = () => {};

// Status icon configuration
const STATUS_ICONS = {
  'Wishlist': '/src/assets/main section icons/material-symbols_bookmark-outline.svg',
  'Applied': '/src/assets/main section icons/Vector.svg',
  'Interviewing': '/src/assets/main section icons/Group.svg',
  'Offer': '/src/assets/main section icons/material-symbols_trophy-outline.svg',
  'Rejected': '/src/assets/main section icons/material-symbols_bookmark-outline.svg',
};

// Empty state text messages for each status
const EMPTY_STATE_MESSAGES = {
  'Wishlist': 'Wishlist Item',
  'Applied': 'Applied Job',
  'Interviewing': 'Interview',
  'Rejected': 'Rejected Job',
};

const ICON_STYLE_BY_STATUS = {
  'Wishlist': BOARD.wishlistIcon,
  'Applied': BOARD.appliedIcon,
  'Interviewing': BOARD.interviewingIcon,
  'Offer': BOARD.offerIcon,
  'Rejected': BOARD.rejectedIcon,
};

const PLUS_ICON_STYLE_BY_STATUS = {
  'Wishlist': BOARD.wishlistPlusIcon,
  'Applied': BOARD.appliedPlusIcon,
  'Interviewing': BOARD.interviewingPlusIcon,
  'Offer': BOARD.offerPlusIcon,
  'Rejected': BOARD.rejectedPlusIcon,
};

const getNowIso = () => new Date().toISOString();

const withStatusHistoryEntry = (app, status, timestamp) => ({
  ...app,
  statusHistory: [...(app.statusHistory || []), {status, timestamp}],
});

const getEmptyStateText = (status) => {
  return `Drag Your First ${EMPTY_STATE_MESSAGES[status] || status} Here!`;
};

const BoardSkeleton = () => (
  <Box sx={BOARD.columnsWrapper}>
    {Array.from({length: 3}).map((_, index) => (
      <Paper key={`board-skeleton-${index}`} elevation={1} sx={BOARD.columnPaper}>
        <Skeleton variant="rounded" height={44} />
        <Stack spacing={1.25} sx={{mt: 1}}>
          <Skeleton variant="rounded" height={95} />
          <Skeleton variant="rounded" height={95} />
          <Skeleton variant="rounded" height={95} />
        </Stack>
      </Paper>
    ))}
  </Box>
);

// Helper component for empty state
const EmptyStateCard = ({ status, colors, iconStyle, statusIcon }) => (
  <Box
    sx={{
      ...BOARD.emptyStateCard,
      borderColor: colors.header,
      background: EMPTY_STATE_GRADIENTS[status],
    }}
  >
    <Box
      component="img"
      src={statusIcon}
      sx={{
        ...BOARD.emptyStateIcon,
        filter: iconStyle?.filter,
      }}
    />
    <Typography
      sx={{
        ...BOARD.emptyStateText,
        color: colors.header,
      }}
    >
      {getEmptyStateText(status)}
    </Typography>
  </Box>
);

// Helper component for draggable items
const DraggableItemWrapper = ({ app, status, updateAppStatus, onDelete, onEdit, onShare }) => {
  const leftStatus = STATUS_ORDER[Math.max(0, STATUS_ORDER.indexOf(status) - 1)];
  const rightStatus = STATUS_ORDER[Math.min(STATUS_ORDER.length - 1, STATUS_ORDER.indexOf(status) + 1)];
  const isFirst = status === STATUS_ORDER[0];
  const isLast = status === STATUS_ORDER.at(-1);

  const handleUpdateAppStatus = (id, toStatus) => {
    if (toStatus) return updateAppStatus(id, toStatus);
    return null;
  };

  return (
    <DraggableItem
      key={app.id}
      app={app}
      leftStatus={leftStatus}
      rightStatus={rightStatus}
      updateAppStatus={handleUpdateAppStatus}
      onDelete={onDelete}
      onEdit={onEdit}
      onShare={onShare}
      isFirst={isFirst}
      isLast={isLast}
    />
  );
};

// Helper component for column header
const ColumnHeader = ({ status, colors, isRejectedStatus, iconStyle, statusIcon, plusIconStyle, onAddClick }) => (
  <Box
    sx={{
      ...BOARD.columnHeader,
      backgroundColor: colors.headerBg,
      borderColor: colors.header,
      '--header-color': colors.header,
      '--header-bg': colors.headerBg,
      '--card-bg': colors.cardBg,
      position: 'relative',
      ...BOARD.statusHeader
    }}
  >
    {!isRejectedStatus && (
      <Box
        component="img"
        src={statusIcon}
        sx={{
          ...BOARD.baseStatusIcon,
          ...iconStyle,
        }}
      />
    )}
    <Typography
      variant="subtitle1"
      sx={{
        ...BOARD.columnTitle,
        ...BOARD.statusTitle,
        color: colors.header,
      }}
    >
      {status === 'Wishlist' ? 'Wishlist' : status}
    </Typography>
    <Box
      component="button"
      onClick={onAddClick}
      sx={{
        ...BOARD.basePlusIcon,
        ...plusIconStyle,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&:hover': {
          opacity: 0.8,
        }
      }}
    >
      <Box
        component="img"
        src="/src/assets/main section icons/plus.svg"
        sx={{
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />
    </Box>
  </Box>
);

const buildColumns = (apps) => {
  const columns = {};
  STATUS_ORDER.forEach((s) => (columns[s] = []));
  apps.forEach((a) => {
    if (!columns[a.status]) columns[a.status] = [];
    columns[a.status].push(a);
  });
  return columns;
};

// Column component moved out of JobApplications for lint rules
const Column = ({status, appsInColumn = [], updateAppStatus, onDelete, onEdit, onShare, onAdd}) => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const {isOver, setNodeRef} = useDroppable({id: status});
  const colors = STATUS_COLORS[status] || STATUS_COLORS.Wishlist;
  const iconStyle = ICON_STYLE_BY_STATUS[status];
  const plusIconStyle = PLUS_ICON_STYLE_BY_STATUS[status];
  const statusIcon = STATUS_ICONS[status];
  const isRejectedStatus = status === 'Rejected';
  const isEmpty = appsInColumn.length === 0;
  const columnStackOverStyle = isOver ? BOARD.columnStackOver : {};

  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setAddModalOpen(false);
  };

  const handleSaveNewApp = (newApp) => {
    onAdd(newApp);
    setAddModalOpen(false);
  };

  return (
    <Paper elevation={1} sx={BOARD.columnPaper}>
      <ColumnHeader
        status={status}
        colors={colors}
        isRejectedStatus={isRejectedStatus}
        iconStyle={iconStyle}
        statusIcon={statusIcon}
        plusIconStyle={plusIconStyle}
        onAddClick={handleOpenAddModal}
      />

      <SortableContext items={appsInColumn.map((a) => a.id)} strategy={rectSortingStrategy}>
        <Stack
          ref={setNodeRef}
          sx={{
            ...BOARD.columnStack,
            backgroundColor: colors.cardBg,
            ...columnStackOverStyle,
            '--header-color': colors.header,
            '--card-bg': colors.cardBg,
          }}
        >
          {isEmpty ? (
            <EmptyStateCard status={status} colors={colors} iconStyle={iconStyle} statusIcon={statusIcon} />
          ) : (
            <>
              {appsInColumn.map((app) => (
                <DraggableItemWrapper
                  key={app.id}
                  app={app}
                  status={status}
                  updateAppStatus={updateAppStatus}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  onShare={onShare}
                />
              ))}
              {isOver && (
                <Box sx={BOARD.dropHint}>↓ Drop here</Box>
              )}
            </>
          )}
        </Stack>
      </SortableContext>

      <AddApplicationModal
        open={addModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveNewApp}
        status={status}
      />
    </Paper>
  );
};

const queryMatchesApp = (app, query) => {
  if (!query) return true;
  const haystack = [
    app.companyName,
    app.company,
    app.jobTitle,
    app.position,
    app.platform,
    app.location,
    app.notes,
    ...(app.tags || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return haystack.includes(query);
};

export default function JobApplications({ apps, setApps, onDeleteApplication, searchQuery = '', isLoading = false }) {
  const [currentView, setCurrentView] = useState('kanban');
  const [selectedApp, setSelectedApp] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  const filteredApps = useMemo(
    () => apps.filter((app) => queryMatchesApp(app, normalizedSearchQuery)),
    [apps, normalizedSearchQuery]
  );

  const columns = useMemo(() => buildColumns(filteredApps), [filteredApps]);

  const [activeId, setActiveId] = useState(null);

  // Use pointer & touch sensors with a small activation constraint for a native feel
  const sensors = useSensors(
    useSensor(PointerSensor, {activationConstraint: {distance: 5}}),
    useSensor(TouchSensor, {activationConstraint: {delay: 150, tolerance: 5}})
  );

  const updateAppStatus = (appId, newStatus) => {
    setApps((prev) => {
      const copy = prev.map((p) => ({...p}));
      const idx = copy.findIndex((c) => c.id === appId);
      if (idx === -1) return prev;
      const now = getNowIso();
      const oldStatus = copy[idx].status;
      copy[idx].status = newStatus;
      copy[idx].updatedAt = now;

      // Add to status history
      if (oldStatus !== newStatus) {
        copy[idx] = withStatusHistoryEntry(copy[idx], newStatus, now);
      }

      return copy;
    });
  };

  const handleDeleteApplication = (appId) => {
    if (onDeleteApplication) {
      onDeleteApplication(appId);
      return;
    }
    setApps((prev) => prev.filter((app) => app.id !== appId));
  };

  const handleAddApplication = (newApp) => {
    setApps((prev) => [...prev, newApp]);
  };

  const handleOpenJobDrawer = (app) => {
    if (!app) return;
    setSelectedApp(app);
    setIsDrawerOpen(true);
  };

  const handleCloseJobDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleSaveNote = (appId, note) => {
    const now = getNowIso();
    setApps((prev) => prev.map((item) => (item.id === appId ? {...item, note, updatedAt: now} : item)));
    setSelectedApp((prev) => (prev && prev.id === appId ? {...prev, note, updatedAt: now} : prev));
  };

  const handleSaveInterviewStatus = (appId) => {
    const now = getNowIso();
    setApps((prev) => prev.map((item) => {
      if (item.id !== appId) return item;
      const updated = {...item, status: INTERVIEWING_STATUS, updatedAt: now};
      return withStatusHistoryEntry(updated, INTERVIEWING_STATUS, now);
    }));
    setSelectedApp((prev) => {
      if (!prev || prev.id !== appId) return prev;
      const updated = {...prev, status: INTERVIEWING_STATUS, updatedAt: now};
      return withStatusHistoryEntry(updated, INTERVIEWING_STATUS, now);
    });
  };

  const handleSaveEdit = (updatedApp) => {
    const now = getNowIso();
    setApps((prev) => prev.map((item) => (item.id === updatedApp.id ? {...updatedApp, updatedAt: now} : item)));
    setIsDrawerOpen(false);
  };

  // Handle drag end to support moving between columns and reordering within columns
  const handleDragEnd = (event) => {
    const activeIdLocal = event.active?.id;
    const overId = event.over?.id;
    setActiveId(null);

    if (!activeIdLocal || !overId || activeIdLocal === overId) return;

    setApps((prev) => {
      const copy = prev.map((p) => ({...p}));
      const activeIndex = copy.findIndex((p) => p.id === activeIdLocal);
      if (activeIndex === -1) return prev;
      const [activeItem] = copy.splice(activeIndex, 1);

      if (STATUS_ORDER.includes(overId)) {
        activeItem.status = overId;
        activeItem.updatedAt = getNowIso();
        const lastIndex = copy.reduce((acc, p, idx) => (p.status === overId ? idx : acc), -1);
        if (lastIndex === -1) copy.push(activeItem);
        else copy.splice(lastIndex + 1, 0, activeItem);
        return copy;
      }

      const overIndex = copy.findIndex((p) => p.id === overId);
      if (overIndex === -1) {
        copy.push(activeItem);
        return copy;
      }

      activeItem.status = copy[overIndex].status;
      activeItem.updatedAt = getNowIso();
      copy.splice(overIndex, 0, activeItem);
      return copy;
    });
  };

  const handleDragStart = (event) => {
    setActiveId(event.active?.id ?? null);
  };

  // Helper to find the active item object for the overlay
  const activeItem = activeId ? apps.find((a) => a.id === activeId) : null;

  const renderDragOverlay = () => {
    if (!activeItem) return null;

    return (
      <Box sx={{width: 340, pointerEvents: 'none'}}>
        <ApplicationCard app={activeItem} status={activeItem.status} onMoveLeft={NOOP} onMoveRight={NOOP}/>
      </Box>
    );
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleShareApplication = async (app) => {
    await shareJobApplication(app);
  };

  return (
    <Box sx={BOARD.container}>
      <ViewToggleBar currentView={currentView} onViewChange={handleViewChange} applications={filteredApps} />
      {normalizedSearchQuery && (
        <Typography sx={BOARD.searchResultLabel}>
          Showing {filteredApps.length} result{filteredApps.length === 1 ? '' : 's'} for "{searchQuery}"
        </Typography>
      )}

      {currentView === 'list' ? (
        <ApplicationsListView
          apps={filteredApps}
          onAdd={handleAddApplication}
          onEdit={handleOpenJobDrawer}
          onDelete={handleDeleteApplication}
          onStatusChange={updateAppStatus}
          isLoading={isLoading}
        />
      ) : (
        isLoading ? (
          <BoardSkeleton />
        ) : (
          <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <Box sx={BOARD.columnsWrapper}>
              {STATUS_ORDER.map((status) => (
                <Column key={status} status={status} appsInColumn={columns[status] || []} updateAppStatus={updateAppStatus} onDelete={handleDeleteApplication} onEdit={handleOpenJobDrawer} onShare={handleShareApplication} onAdd={handleAddApplication}/>
              ))}
            </Box>

            <DragOverlay dropAnimation={{duration: 150, easing: 'ease'}}>
              {renderDragOverlay()}
            </DragOverlay>
          </DndContext>
        )
      )}

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