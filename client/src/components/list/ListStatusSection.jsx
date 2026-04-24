import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { LIST, STATUS_COLORS } from '../../pages/styles/jobApplicationsStyles';
import { JOB_STATUSES } from '../../constants/jobStatuses.js';
import {
  STATUS_ICONS,
  STATUS_ICON_FILTERS,
} from './listView.constants';
import { formatDate } from './listView.utils';

const APP_SHAPE = PropTypes.shape({
  id: PropTypes.string.isRequired,
  companyName: PropTypes.string,
  jobTitle: PropTypes.string,
  platform: PropTypes.string,
  appliedDate: PropTypes.string,
  updatedAt: PropTypes.string,
  status: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
});

const STATUS_COLOR_SHAPE = PropTypes.shape({
  header: PropTypes.string,
  headerBg: PropTypes.string,
});

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

function DragHandle({ listeners, attributes }) {
  return (
    <IconButton size="small" sx={LIST.dragHandleButton} {...listeners} {...attributes}>
      <DragIndicatorIcon fontSize="small" />
    </IconButton>
  );
}

DragHandle.propTypes = {
  listeners: PropTypes.object,
  attributes: PropTypes.object,
};

function DraggableMobileCard({ app, statusColor, onOpenEdit, onOpenDelete, onStatusChange }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: app.id,
  });

  return (
    <Paper
      ref={setNodeRef}
      sx={{
        ...LIST.mobileCard,
        ...LIST.draggableCard,
        ...(isDragging ? LIST.draggingItem : {}),
        transform: transform ? CSS.Translate.toString(transform) : undefined,
      }}
    >
      <Box sx={LIST.mobileCardTopRow}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
          <DragHandle listeners={listeners} attributes={attributes} />
          <Box>
            <Typography sx={LIST.mobileCompany}>{app.companyName}</Typography>
            <Typography sx={LIST.mobileRole}>{app.jobTitle}</Typography>
          </Box>
        </Box>
        <Box sx={LIST.mobileActions}>
          <IconButton size="small" onClick={() => onOpenEdit(app)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => onOpenDelete(app)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Stack direction="row" spacing={1} sx={LIST.mobileMetaRow}>
        <Typography sx={LIST.mobileMetaText}>Platform: {app.platform || '--'}</Typography>
        <Typography sx={LIST.mobileMetaText}>Applied: {formatDate(app.appliedDate)}</Typography>
      </Stack>

      <Stack direction="row" spacing={1} sx={LIST.mobileMetaRow}>
        <Typography sx={LIST.mobileMetaText}>Updated: {formatDate(app.updatedAt)}</Typography>
      </Stack>

      <FormControl size="small" sx={LIST.mobileStatusControl}>
        <InputLabel>Move To</InputLabel>
        <Select
          variant="outlined"
          value={app.status}
          label="Move To"
          onChange={(event) => onStatusChange(app.id, event.target.value)}
          sx={{ ...LIST.statusSelect, color: statusColor.header }}
        >
          {JOB_STATUSES.map((nextStatus) => (
            <MenuItem key={nextStatus} value={nextStatus}>
              {nextStatus}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Stack direction="row" spacing={0.5} sx={LIST.tagsWrap}>
        {(app.tags || []).slice(0, 4).map((tag) => (
          <Chip key={tag} label={tag} size="small" sx={LIST.tagChip} />
        ))}
      </Stack>
    </Paper>
  );
}

DraggableMobileCard.propTypes = {
  app: APP_SHAPE.isRequired,
  statusColor: STATUS_COLOR_SHAPE,
  onOpenEdit: PropTypes.func.isRequired,
  onOpenDelete: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
};

function DraggableDesktopRow({ app, statusColor, onOpenEdit, onOpenDelete, onStatusChange }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: app.id,
  });

  return (
    <TableRow
      ref={setNodeRef}
      hover
      sx={{
        ...LIST.row,
        ...LIST.draggableRow,
        ...(isDragging ? LIST.draggingItem : {}),
        transform: transform ? CSS.Translate.toString(transform) : undefined,
      }}
    >
      <TableCell sx={LIST.bodyCell}>
        <DragHandle listeners={listeners} attributes={attributes} />
      </TableCell>
      <TableCell sx={LIST.bodyCell}>{app.companyName}</TableCell>
      <TableCell sx={LIST.bodyCell}>{app.jobTitle}</TableCell>
      <TableCell sx={LIST.bodyCell}>{app.platform || '--'}</TableCell>
      <TableCell sx={LIST.bodyCell}>{formatDate(app.appliedDate)}</TableCell>
      <TableCell sx={LIST.bodyCell}>{formatDate(app.updatedAt)}</TableCell>
      <TableCell sx={LIST.bodyCell}>
        <Stack direction="row" spacing={0.5} sx={LIST.tagsWrap}>
          {(app.tags || []).slice(0, 3).map((tag) => (
            <Chip key={tag} label={tag} size="small" sx={LIST.tagChip} />
          ))}
        </Stack>
      </TableCell>
      <TableCell sx={LIST.bodyCell}>
        <Select
          size="small"
          variant="outlined"
          value={app.status}
          onChange={(event) => onStatusChange(app.id, event.target.value)}
          sx={{ ...LIST.statusSelect, color: statusColor.header }}
        >
          {JOB_STATUSES.map((nextStatus) => (
            <MenuItem key={nextStatus} value={nextStatus}>
              {nextStatus}
            </MenuItem>
          ))}
        </Select>
      </TableCell>
      <TableCell sx={LIST.bodyCell} align="right">
        <IconButton size="small" onClick={() => onOpenEdit(app)}>
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" color="error" onClick={() => onOpenDelete(app)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

DraggableDesktopRow.propTypes = {
  app: APP_SHAPE.isRequired,
  statusColor: STATUS_COLOR_SHAPE,
  onOpenEdit: PropTypes.func.isRequired,
  onOpenDelete: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
};

function SectionContent({
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

SectionContent.propTypes = {
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

function ListStatusSection({
  status,
  items,
  isCollapsed,
  isDragging,
  isMobile,
  onToggleSection,
  onAutoExpandSection,
  onOpenEdit,
  onOpenDelete,
  onStatusChange,
}) {
  const statusColor = STATUS_COLORS[status] || STATUS_COLORS.Wishlist;

  return (
    <Paper sx={LIST.sectionPaper}>
      <Box
        component="button"
        type="button"
        onClick={() => onToggleSection(status)}
        aria-expanded={!isCollapsed}
        sx={{
          ...LIST.sectionHeader,
          ...LIST.sectionHeaderButton,
          borderColor: statusColor.header,
          backgroundColor: statusColor.headerBg,
        }}
      >
        <Box sx={LIST.sectionHeaderLeft}>
          <Box
            component="img"
            src={STATUS_ICONS[status]}
            alt={status}
            sx={{ ...LIST.sectionIcon, filter: STATUS_ICON_FILTERS[status] }}
          />
          <Typography sx={{ ...LIST.sectionTitle, color: statusColor.header }}>{status}</Typography>
        </Box>
        <Box sx={LIST.sectionHeaderRight}>
          <Box sx={{ ...LIST.sectionCountBadge, color: statusColor.header, borderColor: statusColor.header }}>
            {items.length}
          </Box>
          <ExpandMoreIcon
            sx={{
              ...LIST.sectionCollapseIcon,
              ...(isCollapsed ? LIST.sectionCollapseIconCollapsed : {}),
            }}
          />
        </Box>
      </Box>

      <SectionContent
        status={status}
        items={items}
        isCollapsed={isCollapsed}
        isDragging={isDragging}
        isMobile={isMobile}
        statusColor={statusColor}
        onAutoExpandSection={onAutoExpandSection}
        onOpenEdit={onOpenEdit}
        onOpenDelete={onOpenDelete}
        onStatusChange={onStatusChange}
      />
    </Paper>
  );
}

ListStatusSection.propTypes = {
  status: PropTypes.oneOf(JOB_STATUSES).isRequired,
  items: PropTypes.arrayOf(APP_SHAPE).isRequired,
  isCollapsed: PropTypes.bool,
  isDragging: PropTypes.bool,
  isMobile: PropTypes.bool,
  onToggleSection: PropTypes.func.isRequired,
  onAutoExpandSection: PropTypes.func.isRequired,
  onOpenEdit: PropTypes.func.isRequired,
  onOpenDelete: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
};

export default memo(ListStatusSection);
