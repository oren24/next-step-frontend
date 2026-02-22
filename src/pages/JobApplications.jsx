import React, {useMemo, useState} from 'react';
import {Box, Paper, Stack, Typography} from '@mui/material';
import {mockApplications} from '../data/mockApplications.js';
import {DndContext, useDroppable, DragOverlay, useSensor, useSensors} from '@dnd-kit/core';
import {rectSortingStrategy, SortableContext} from '@dnd-kit/sortable';
import {PointerSensor, TouchSensor} from '@dnd-kit/core';
import DraggableItem from '../components/cards/DraggableItem.jsx';
import ApplicationCard from '../components/cards/ApplicationCard.jsx';
import ViewToggleBar from '../components/layout/ViewToggleBar.jsx';
import {BOARD, STATUS_COLORS, EMPTY_STATE_GRADIENTS} from './styles/jobApplicationsStyles';

const STATUS_ORDER = ['Wishlist', 'Applied', 'Interviewing', 'Offer', 'Rejected'];

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
const Column = ({status, appsInColumn = [], updateAppStatus}) => {
  const {isOver, setNodeRef} = useDroppable({id: status});
  const colors = STATUS_COLORS[status] || STATUS_COLORS.Wishlist;

  // Define icon paths for each status
  const statusIcons = {
    'Wishlist': '/src/assets/main section icons/material-symbols_bookmark-outline.svg',
    'Applied': '/src/assets/main section icons/Vector.svg',
    'Interviewing': '/src/assets/main section icons/Group.svg', 
    'Offer': '/src/assets/main section icons/material-symbols_trophy-outline.svg',
    'Rejected': '/src/assets/main section icons/material-symbols_bookmark-outline.svg' // fallback
  };

  // Define icon styles for each status
  const iconStyles = {
    'Wishlist': BOARD.wishlistIcon,
    'Applied': BOARD.appliedIcon,
    'Interviewing': BOARD.interviewingIcon,
    'Offer': BOARD.offerIcon,
    'Rejected': BOARD.rejectedIcon
  };

  // Define plus icon styles for each status
  const plusIconStyles = {
    'Wishlist': BOARD.wishlistPlusIcon,
    'Applied': BOARD.appliedPlusIcon,
    'Interviewing': BOARD.interviewingPlusIcon,
    'Offer': BOARD.offerPlusIcon,
    'Rejected': BOARD.rejectedPlusIcon
  };

  return (
    <Paper elevation={1} sx={BOARD.columnPaper}>
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
        {status !== 'Rejected' && (
          <Box
            component="img"
            src={statusIcons[status]}
            sx={{
              ...BOARD.baseStatusIcon,
              ...iconStyles[status],
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
          component="img"
          src="/src/assets/main section icons/plus.svg"
          sx={{
            ...BOARD.basePlusIcon,
            ...plusIconStyles[status],
          }}
        />
      </Box>

      <SortableContext items={appsInColumn.map((a) => a.id)} strategy={rectSortingStrategy}>
        <Stack
          ref={setNodeRef}
          sx={{
            ...BOARD.columnStack,
            backgroundColor: colors.cardBg,
            ...(isOver ? BOARD.columnStackOver : {}),
            '--header-color': colors.header,
            '--card-bg': colors.cardBg,
          }}
        >
          {appsInColumn.length === 0 ? (
            // Empty State Card
            <Box
              sx={{
                ...BOARD.emptyStateCard,
                borderColor: colors.header,
                background: EMPTY_STATE_GRADIENTS[status],
              }}
            >
              <Box
                component="img"
                src={statusIcons[status]}
                sx={{
                  ...BOARD.emptyStateIcon,
                  filter: iconStyles[status]?.filter,
                }}
              />
              <Typography
                sx={{
                  ...BOARD.emptyStateText,
                  color: colors.header,
                }}
              >
                {`Drag Your First ${
                  status === 'Wishlist' ? 'Wishlist Item' :
                  status === 'Applied' ? 'Applied Job' :
                  status === 'Interviewing' ? 'Interview' :
                  status === 'Rejected' ? 'Rejected Job' :
                  status
                } Here!`}
              </Typography>
            </Box>
          ) : (
            appsInColumn.map((app) => {
              const leftStatus = STATUS_ORDER[Math.max(0, STATUS_ORDER.indexOf(status) - 1)];
              const rightStatus = STATUS_ORDER[Math.min(STATUS_ORDER.length - 1, STATUS_ORDER.indexOf(status) + 1)];

              return (
                <DraggableItem
                  key={app.id}
                  app={app}
                  leftStatus={leftStatus}
                  rightStatus={rightStatus}
                  updateAppStatus={(id, toStatus) => {
                    if (toStatus) return updateAppStatus(id, toStatus);
                    return null;
                  }}
                  isFirst={status === STATUS_ORDER[0]}
                  isLast={status === STATUS_ORDER.at(-1)}
                />
              );
            })
          )}
        </Stack>
      </SortableContext>
    </Paper>
  );
};

export default function JobApplications() {
  const [apps, setApps] = useState(() => mockApplications.map((a) => ({...a})));
  const [currentView, setCurrentView] = useState('kanban');

  const columns = useMemo(() => buildColumns(apps), [apps]);

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
      copy[idx].status = newStatus;
      copy[idx].updatedAt = new Date().toISOString();
      return copy;
    });
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
        activeItem.updatedAt = new Date().toISOString();
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
      activeItem.updatedAt = new Date().toISOString();
      copy.splice(overIndex, 0, activeItem);
      return copy;
    });
  };

  const handleDragStart = (event) => {
    setActiveId(event.active?.id ?? null);
  };

  // Helper to find the active item object for the overlay
  const activeItem = activeId ? apps.find((a) => a.id === activeId) : null;

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  return (
    <Box sx={BOARD.container}>
      <ViewToggleBar currentView={currentView} onViewChange={handleViewChange} />
      
      {currentView === 'list' ? (
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '400px',
            fontSize: '24px',
            fontWeight: 600,
            color: 'text.primary'
          }}
        >
          TBD
        </Box>
      ) : (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <Box sx={BOARD.columnsWrapper}>
            {STATUS_ORDER.map((status) => (
              <Column key={status} status={status} appsInColumn={columns[status] || []} updateAppStatus={updateAppStatus}/>
            ))}
          </Box>

          <DragOverlay dropAnimation={{duration: 150, easing: 'ease'}}>
            {activeItem ? (
              <Box sx={{width: 340, pointerEvents: 'none'}}>
                <ApplicationCard app={activeItem} status={activeItem.status} onMoveLeft={() => {}} onMoveRight={() => {}}/>
              </Box>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </Box>
  );
}
