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
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { LIST } from '../../pages/styles/jobApplicationsStyles';
import { JOB_STATUSES } from '../../constants/jobStatuses.js';
import { formatDate } from './listView.utils';

export const APP_SHAPE = PropTypes.shape({
  id: PropTypes.string.isRequired,
  companyName: PropTypes.string,
  jobTitle: PropTypes.string,
  platform: PropTypes.string,
  appliedDate: PropTypes.string,
  updatedAt: PropTypes.string,
  status: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
});

export const STATUS_COLOR_SHAPE = PropTypes.shape({
  header: PropTypes.string,
  headerBg: PropTypes.string,
});

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

export function DraggableMobileCard({ app, statusColor, onOpenEdit, onOpenDelete, onStatusChange }) {
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

export function DraggableDesktopRow({ app, statusColor, onOpenEdit, onOpenDelete, onStatusChange }) {
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

