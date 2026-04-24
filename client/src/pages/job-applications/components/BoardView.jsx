import PropTypes from 'prop-types';
import { Box, Paper, Skeleton, Stack } from '@mui/material';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import ApplicationCard from '../../../components/cards/ApplicationCard.jsx';
import { BOARD } from '../../styles/jobApplicationsStyles.js';
import { NOOP } from '../constants/boardConstants.js';
import Column from './Column.jsx';
import { memo, useMemo } from 'react';

const DRAG_OVERLAY_ANIMATION = { duration: 120, easing: 'ease' };

function BoardSkeleton() {
  return (
    <Box sx={BOARD.columnsWrapper}>
      {Array.from({ length: 3 }).map((_, index) => (
        <Paper key={`board-skeleton-${index}`} elevation={1} sx={BOARD.columnPaper}>
          <Skeleton variant="rounded" height={44} />
          <Stack spacing={1.25} sx={{ mt: 1 }}>
            <Skeleton variant="rounded" height={95} />
            <Skeleton variant="rounded" height={95} />
            <Skeleton variant="rounded" height={95} />
          </Stack>
        </Paper>
      ))}
    </Box>
  );
}

export function BoardView({
  statusOrder,
  columns,
  isLoading,
  activeId,
  apps,
  updateAppStatus,
  onOpen,
  onRequestEdit,
  onRequestDelete,
  onShare,
  onAdd,
  sensors,
  onDragStart,
  onDragCancel,
  onDragEnd,
}) {
  const appsById = useMemo(
    () => new Map(apps.map((app) => [app.id, app])),
    [apps]
  );

  const activeItem = useMemo(
    () => (activeId ? (appsById.get(activeId) ?? null) : null),
    [activeId, appsById]
  );

  if (isLoading) {
    return <BoardSkeleton />;
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragCancel={onDragCancel}
      onDragEnd={onDragEnd}
    >
      <Box sx={BOARD.columnsWrapper}>
        {statusOrder.map((status) => (
          <Column
            key={status}
            status={status}
            appsInColumn={columns[status] || []}
            statusOrder={statusOrder}
            updateAppStatus={updateAppStatus}
            onOpen={onOpen}
            onRequestEdit={onRequestEdit}
            onRequestDelete={onRequestDelete}
            onShare={onShare}
            onAdd={onAdd}
          />
        ))}
      </Box>

      <DragOverlay dropAnimation={DRAG_OVERLAY_ANIMATION}>
        {activeItem ? (
          <Box sx={{ width: 340, pointerEvents: 'none' }}>
            <ApplicationCard
              app={activeItem}
              status={activeItem.status}
              onMoveLeft={NOOP}
              onMoveRight={NOOP}
            />
          </Box>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

BoardView.propTypes = {
  statusOrder: PropTypes.arrayOf(PropTypes.string).isRequired,
  columns: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
  activeId: PropTypes.string,
  apps: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired })).isRequired,
  updateAppStatus: PropTypes.func.isRequired,
  onOpen: PropTypes.func,
  onRequestEdit: PropTypes.func,
  onRequestDelete: PropTypes.func,
  onShare: PropTypes.func,
  onAdd: PropTypes.func.isRequired,
  sensors: PropTypes.any,
  onDragStart: PropTypes.func.isRequired,
  onDragCancel: PropTypes.func.isRequired,
  onDragEnd: PropTypes.func.isRequired,
};

export default memo(BoardView);
