import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
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
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import AddApplicationModal from '../popapmodals/AddApplicationModal.jsx';
import EditApplicationModal from '../popapmodals/EditApplicationModal.jsx';
import DeleteApplicationModal from '../popapmodals/DeleteApplicationModal.jsx';
import { LIST, STATUS_COLORS } from '../../pages/styles/jobApplicationsStyles';

const JOB_STATUSES = ['Wishlist', 'Applied', 'Interviewing', 'Offer', 'Rejected'];
const STATUS_FILTERS = ['All', ...JOB_STATUSES];
const STATUS_ICONS = {
  Wishlist: '/src/assets/main section icons/material-symbols_bookmark-outline.svg',
  Applied: '/src/assets/main section icons/Vector.svg',
  Interviewing: '/src/assets/main section icons/Group.svg',
  Offer: '/src/assets/main section icons/material-symbols_trophy-outline.svg',
  Rejected: '/src/assets/main section icons/material-symbols_bookmark-outline.svg',
};

const STATUS_ICON_FILTERS = {
  Wishlist: 'brightness(0) saturate(100%) invert(20%) sepia(69%) saturate(3151%) hue-rotate(243deg) brightness(98%) contrast(97%)',
  Applied: 'brightness(0) saturate(100%) invert(65%) sepia(52%) saturate(6142%) hue-rotate(338deg) brightness(102%) contrast(96%)',
  Interviewing: 'brightness(0) saturate(100%) invert(66%) sepia(63%) saturate(1425%) hue-rotate(10deg) brightness(104%) contrast(98%)',
  Offer: 'brightness(0) saturate(100%) invert(58%) sepia(60%) saturate(402%) hue-rotate(78deg) brightness(119%) contrast(89%)',
  Rejected: 'brightness(0) saturate(100%) invert(67%) sepia(7%) saturate(928%) hue-rotate(169deg) brightness(96%) contrast(88%)',
};

const SORT_OPTIONS = [
  { value: 'updatedAt', label: 'Updated' },
  { value: 'appliedDate', label: 'Applied Date' },
  { value: 'companyName', label: 'Company' },
  { value: 'jobTitle', label: 'Role' },
];

const formatDate = (isoDate) => {
  if (!isoDate) return '--';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '--';
  return date.toLocaleDateString();
};

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
          {isOver ? `✓ Release to move here` : `Drop here to move to ${id}`}
        </Box>
      )}
    </Box>
  );
}

function DragHandle({ listeners, attributes }) {
  return (
    <IconButton size="small" sx={LIST.dragHandleButton} {...listeners} {...attributes}>
      <DragIndicatorIcon fontSize="small" />
    </IconButton>
  );
}

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

export default function ApplicationsListView({ apps, onAdd, onEdit, onDelete, onStatusChange }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [addOpen, setAddOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [activeId, setActiveId] = useState(null);
  const [collapsedSections, setCollapsedSections] = useState(() => (
    Object.fromEntries(JOB_STATUSES.map((status) => [status, false]))
  ));

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 5 } })
  );

  const rows = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const filtered = apps.filter((app) => {
      const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
      if (!normalizedQuery) return matchesStatus;
      const text = [app.companyName, app.jobTitle, app.platform, app.location, ...(app.tags || [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return matchesStatus && text.includes(normalizedQuery);
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'updatedAt' || sortBy === 'appliedDate') {
        const aTime = a[sortBy] ? new Date(a[sortBy]).getTime() : 0;
        const bTime = b[sortBy] ? new Date(b[sortBy]).getTime() : 0;
        return aTime - bTime;
      }

      return (a[sortBy] || '').localeCompare(b[sortBy] || '');
    });

    return sortDirection === 'asc' ? sorted : sorted.reverse();
  }, [apps, searchQuery, sortBy, sortDirection, statusFilter]);

  const groupedRows = useMemo(() => {
    const sections = statusFilter === 'All' ? JOB_STATUSES : [statusFilter];
    return sections.map((status) => ({
      status,
      items: rows.filter((app) => app.status === status),
    }));
  }, [rows, statusFilter]);

  const handleOpenEdit = (app) => {
    setSelectedApp(app);
    setEditModalOpen(true);
  };

  const handleOpenDelete = (app) => {
    setSelectedApp(app);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedApp || !onDelete) return;
    await onDelete(selectedApp.id);
    setDeleteModalOpen(false);
    setSelectedApp(null);
  };

  const handleEditSave = async (updatedApp) => {
    if (!onEdit) return;
    await onEdit(updatedApp);
    setEditModalOpen(false);
    setSelectedApp(null);
  };

  const handleToggleSection = (status) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  const handleAutoExpandSection = (status) => {
    setCollapsedSections((prev) => {
      if (!prev[status]) return prev;
      return {
        ...prev,
        [status]: false,
      };
    });
  };

  const handleDragEnd = (event) => {
    setActiveId(null);
    const appId = event.active?.id;
    const nextStatus = event.over?.id;
    if (!appId || !nextStatus || !JOB_STATUSES.includes(nextStatus)) return;

    const activeApp = apps.find((app) => app.id === appId);
    if (!activeApp || activeApp.status === nextStatus) return;
    onStatusChange(appId, nextStatus);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  let content;
  const isDragging = activeId !== null;
  const activeApp = activeId ? apps.find((a) => a.id === activeId) : null;

  if (rows.length === 0) {
    content = <Paper sx={LIST.emptyState}>No matching applications.</Paper>;
  } else {
    content = (
      <DndContext
        sensors={sensors}
        onDragStart={(e) => setActiveId(e.active?.id ?? null)}
        onDragCancel={handleDragCancel}
        onDragEnd={handleDragEnd}
      >
        <Stack sx={LIST.sectionsStack}>
          {groupedRows.map(({ status, items }) => {
          const statusColor = STATUS_COLORS[status] || STATUS_COLORS.Wishlist;
          const isCollapsed = collapsedSections[status] ?? false;
          let sectionContent;

          if (isCollapsed) {
            sectionContent = (
              <DroppableSection
                id={status}
                isDragging={isDragging}
                isCollapsed={isCollapsed}
                onAutoExpand={handleAutoExpandSection}
              >
                <Box sx={LIST.sectionCollapsedBody}>
                  Section collapsed. Expand to view applications.
                </Box>
              </DroppableSection>
            );
          } else if (items.length === 0) {
            sectionContent = (
              <DroppableSection id={status} isDragging={isDragging}>
                <Box sx={LIST.sectionEmpty}>No applications in this status.</Box>
              </DroppableSection>
            );
          } else if (isMobile) {
            sectionContent = (
              <DroppableSection id={status} isDragging={isDragging}>
                <Stack spacing={1.5} sx={LIST.sectionBody}>
                  {items.map((app) => (
                    <DraggableMobileCard
                      key={app.id}
                      app={app}
                      statusColor={statusColor}
                      onOpenEdit={handleOpenEdit}
                      onOpenDelete={handleOpenDelete}
                      onStatusChange={onStatusChange}
                    />
                  ))}
                </Stack>
              </DroppableSection>
            );
          } else {
            sectionContent = (
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
                          onOpenEdit={handleOpenEdit}
                          onOpenDelete={handleOpenDelete}
                          onStatusChange={onStatusChange}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </DroppableSection>
            );
          }

          return (
            <Paper key={status} sx={LIST.sectionPaper}>
              <Box
                component="button"
                type="button"
                onClick={() => handleToggleSection(status)}
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

              {sectionContent}
            </Paper>
          );
          })}
        </Stack>

        <DragOverlay dropAnimation={{ duration: 120, easing: 'ease' }}>
          {activeApp ? (
            <Paper sx={LIST.listDragOverlay}>
              <DragIndicatorIcon fontSize="small" sx={{ color: 'text.secondary', flexShrink: 0 }} />
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: '14px', lineHeight: 1.2 }}>
                  {activeApp.companyName}
                </Typography>
                <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                  {activeApp.jobTitle}
                </Typography>
              </Box>
            </Paper>
          ) : null}
        </DragOverlay>
      </DndContext>
    );
  }

  return (
    <Box sx={LIST.container}>
      <Box sx={LIST.headerRow}>
        <Typography sx={LIST.title}>Applications List</Typography>
        <Button startIcon={<AddIcon />} variant="contained" onClick={() => setAddOpen(true)}>
          Add Application
        </Button>
      </Box>

      <Box sx={LIST.controlsRow}>
        <TextField
          size="small"
          label="Search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Company, role, platform, tag"
          sx={LIST.searchField}
        />

        <FormControl size="small" sx={LIST.filterControl}>
          <InputLabel>Status</InputLabel>
          <Select
            variant="outlined"
            value={statusFilter}
            label="Status"
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            {STATUS_FILTERS.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={LIST.filterControl}>
          <InputLabel>Sort By</InputLabel>
          <Select
            variant="outlined"
            value={sortBy}
            label="Sort By"
            onChange={(event) => setSortBy(event.target.value)}
          >
            {SORT_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={LIST.filterControl}>
          <InputLabel>Order</InputLabel>
          <Select
            variant="outlined"
            value={sortDirection}
            label="Order"
            onChange={(event) => setSortDirection(event.target.value)}
          >
            <MenuItem value="desc">Descending</MenuItem>
            <MenuItem value="asc">Ascending</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {content}

      <AddApplicationModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={(newApp) => {
          onAdd(newApp);
          setAddOpen(false);
        }}
        status="Wishlist"
      />

      <EditApplicationModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleEditSave}
        application={selectedApp}
      />

      <DeleteApplicationModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        application={selectedApp}
      />
    </Box>
  );
}

