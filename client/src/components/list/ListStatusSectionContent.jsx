import { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useDroppable } from '@dnd-kit/core';
import { LIST } from '../../pages/styles/jobApplicationsStyles';
import { JOB_STATUSES } from '../../constants/jobStatuses.js';
import {
  APP_SHAPE,
  DraggableDesktopRow,
  DraggableMobileCard,
  STATUS_COLOR_SHAPE,
} from './ListStatusRows.jsx';

function DroppableSection({ id, children, isDragging, isCollapsed = false, onAutoExpand }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  useEffect(() => {
    if (!isDragging || !isCollapsed || !isOver || !onAutoExpand) return undefined;

    const timeoutId = globalThis.setTimeout(() => {
      onAutoExpand(id);
    }, 350);

    return () => {
      globalThis.clearTimeout(timeoutId);
    };
  }, [id, isCollapsed, isDragging, isOver, onAutoExpand]);

  return (
    <Box
      ref={setNodeRef}
      sx={{
        ...LIST.sectionBodyDroppable,
        ...(isOver ? LIST.sectionBodyOver : {}),
      }}
    >
      {children}
      {isDragging && (
        <Box sx={{ ...LIST.listDropHint, ...(isOver ? LIST.listDropHintActive : {}) }}>
          {isOver ? 'Release to move here' : `Drop here to move to ${id}`}
        </Box>
      )}
    </Box>
  );
}

DroppableSection.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node,
  isDragging: PropTypes.bool,
  isCollapsed: PropTypes.bool,
  onAutoExpand: PropTypes.func,
};

export default function ListStatusSectionContent({
  status,
  items,
  isCollapsed,
  isDragging,
  isMobile,
  statusColor,
  onAutoExpandSection,
  onOpenEdit,
  onOpenDelete,
  onStatusChange,
}) {
  if (isCollapsed) {
    return (
      <DroppableSection
        id={status}
        isDragging={isDragging}
        isCollapsed={isCollapsed}
        onAutoExpand={onAutoExpandSection}
      >
        <Box sx={LIST.sectionCollapsedBody}>
          Section collapsed. Expand to view applications.
        </Box>
      </DroppableSection>
    );
  }

  if (items.length === 0) {
    return (
      <DroppableSection id={status} isDragging={isDragging}>
        <Box sx={LIST.sectionEmpty}>No applications in this status.</Box>
      </DroppableSection>
    );
  }

  if (isMobile) {
    return (
      <DroppableSection id={status} isDragging={isDragging}>
        <Stack spacing={1.5} sx={LIST.sectionBody}>
          {items.map((app) => (
            <DraggableMobileCard
              key={app.id}
              app={app}
              statusColor={statusColor}
              onOpenEdit={onOpenEdit}
              onOpenDelete={onOpenDelete}
              onStatusChange={onStatusChange}
            />
          ))}
        </Stack>
      </DroppableSection>
    );
  }

  return (
    <DroppableSection id={status} isDragging={isDragging}>
      <TableContainer sx={LIST.tableContainer}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={LIST.headCell}>Drag</TableCell>
              <TableCell sx={LIST.headCell}>Company</TableCell>
              <TableCell sx={LIST.headCell}>Role</TableCell>
              <TableCell sx={LIST.headCell}>Platform</TableCell>
              <TableCell sx={LIST.headCell}>Applied</TableCell>
              <TableCell sx={LIST.headCell}>Updated</TableCell>
              <TableCell sx={LIST.headCell}>Tags</TableCell>
              <TableCell sx={LIST.headCell}>Move To</TableCell>
              <TableCell sx={LIST.headCell} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((app) => (
              <DraggableDesktopRow
                key={app.id}
                app={app}
                statusColor={statusColor}
                onOpenEdit={onOpenEdit}
                onOpenDelete={onOpenDelete}
                onStatusChange={onStatusChange}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </DroppableSection>
  );
}

ListStatusSectionContent.propTypes = {
  status: PropTypes.oneOf(JOB_STATUSES).isRequired,
  items: PropTypes.arrayOf(APP_SHAPE).isRequired,
  isCollapsed: PropTypes.bool,
  isDragging: PropTypes.bool,
  isMobile: PropTypes.bool,
  statusColor: STATUS_COLOR_SHAPE,
  onAutoExpandSection: PropTypes.func.isRequired,
  onOpenEdit: PropTypes.func.isRequired,
  onOpenDelete: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
};

