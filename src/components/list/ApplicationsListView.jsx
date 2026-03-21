import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { DndContext, DragOverlay, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import AddApplicationModal from '../popapmodals/AddApplicationModal.jsx';
import DeleteApplicationModal from '../popapmodals/DeleteApplicationModal.jsx';
import { LIST } from '../../pages/styles/jobApplicationsStyles';
import { JOB_STATUSES } from '../../constants/jobStatuses.js';
import {
  STATUS_FILTERS,
  SORT_OPTIONS,
} from './listView.constants';
import { buildGroupedRows, buildRows } from './listView.utils';
import ListStatusSection from './ListStatusSection.jsx';

const DEFAULT_STATUS_FILTER = 'All';
const DEFAULT_SORT_BY = 'updatedAt';
const DEFAULT_SORT_DIRECTION = 'desc';
const DEFAULT_NEW_APP_STATUS = 'Wishlist';

const createInitialCollapsedSections = () => (
  Object.fromEntries(JOB_STATUSES.map((status) => [status, false]))
);

const APP_SHAPE = PropTypes.shape({
  id: PropTypes.string.isRequired,
  status: PropTypes.string,
  companyName: PropTypes.string,
  jobTitle: PropTypes.string,
  platform: PropTypes.string,
  location: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  appliedDate: PropTypes.string,
  updatedAt: PropTypes.string,
});

function ApplicationsListView({ apps, onAdd, onEdit, onDelete, onStatusChange, isLoading = false }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [addOpen, setAddOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [statusFilter, setStatusFilter] = useState(DEFAULT_STATUS_FILTER);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState(DEFAULT_SORT_BY);
  const [sortDirection, setSortDirection] = useState(DEFAULT_SORT_DIRECTION);
  const [activeId, setActiveId] = useState(null);
  const [collapsedSections, setCollapsedSections] = useState(createInitialCollapsedSections);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 5 } })
  );

  const rows = useMemo(
    () => buildRows({ apps, searchQuery, sortBy, sortDirection, statusFilter }),
    [apps, searchQuery, sortBy, sortDirection, statusFilter]
  );

  const sections = useMemo(
    () => buildGroupedRows({ rows, statusFilter }),
    [rows, statusFilter]
  );

  const handleOpenEdit = (app) => {
    if (onEdit) onEdit(app);
  };

  const handleOpenDelete = (app) => {
    setSelectedApp(app);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedApp(null);
  };

  const handleOpenAddModal = () => {
    setAddOpen(true);
  };

  const handleCloseAddModal = () => {
    setAddOpen(false);
  };

  const handleSaveApplication = (newApp) => {
    onAdd(newApp);
    setAddOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleSortByChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleSortDirectionChange = (event) => {
    setSortDirection(event.target.value);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedApp || !onDelete) return;
    await onDelete(selectedApp.id);
    setDeleteModalOpen(false);
    setSelectedApp(null);
  };

  const handleToggleSection = (status) => {
    setCollapsedSections((prev) => ({ ...prev, [status]: !prev[status] }));
  };

  const handleAutoExpandSection = (status) => {
    setCollapsedSections((prev) => {
      if (!prev[status]) return prev;
      return { ...prev, [status]: false };
    });
  };

  const handleDragEnd = (event) => {
    setActiveId(null);
    const appId = event.active?.id;
    const nextStatus = event.over?.id;
    const isValidDropStatus = JOB_STATUSES.includes(nextStatus);
    if (!appId || !nextStatus || !isValidDropStatus) return;

    const activeApp = apps.find((app) => app.id === appId);
    if (!activeApp || activeApp.status === nextStatus) return;
    onStatusChange(appId, nextStatus);
  };

  const handleDragStart = (event) => {
    setActiveId(event.active?.id ?? null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const isDragging = activeId !== null;
  const activeApp = activeId ? apps.find((app) => app.id === activeId) : null;

  const renderActiveDragOverlay = () => {
    if (!activeApp) return null;

    return (
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
    );
  };

  const renderLoadingSections = () => (
    <Box sx={LIST.sectionsStack}>
      {Array.from({ length: 3 }).map((_, index) => (
        <Paper key={`list-loading-${index}`} sx={LIST.sectionPaper}>
          <Box sx={{ p: 1.5 }}>
            <Skeleton variant="text" width="30%" height={28} />
            <Skeleton variant="rounded" height={56} sx={{ mt: 1 }} />
            <Skeleton variant="rounded" height={56} sx={{ mt: 1 }} />
          </Box>
        </Paper>
      ))}
    </Box>
  );

  return (
    <Box sx={LIST.container}>
      <Box sx={LIST.headerRow}>
        <Typography sx={LIST.title}>Applications List</Typography>
        <Button startIcon={<AddIcon />} variant="contained" onClick={handleOpenAddModal}>
          Add Application
        </Button>
      </Box>

      <Box sx={LIST.controlsRow}>
        <TextField
          size="small"
          label="Search"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Company, role, platform, tag"
          sx={LIST.searchField}
        />

        <FormControl size="small" sx={LIST.filterControl}>
          <InputLabel>Status</InputLabel>
          <Select
            variant="outlined"
            value={statusFilter}
            label="Status"
            onChange={handleStatusFilterChange}
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
            onChange={handleSortByChange}
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
            onChange={handleSortDirectionChange}
          >
            <MenuItem value="desc">Descending</MenuItem>
            <MenuItem value="asc">Ascending</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {isLoading ? (
        renderLoadingSections()
      ) : rows.length === 0 ? (
        <Paper sx={LIST.emptyState}>No matching applications.</Paper>
      ) : (
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragCancel={handleDragCancel}
          onDragEnd={handleDragEnd}
        >
          <Box sx={LIST.sectionsStack}>
            {sections.map(({ status, items }) => (
              <ListStatusSection
                key={status}
                status={status}
                items={items}
                isCollapsed={collapsedSections[status] ?? false}
                isDragging={isDragging}
                isMobile={isMobile}
                onToggleSection={handleToggleSection}
                onAutoExpandSection={handleAutoExpandSection}
                onOpenEdit={handleOpenEdit}
                onOpenDelete={handleOpenDelete}
                onStatusChange={onStatusChange}
              />
            ))}
          </Box>

          <DragOverlay dropAnimation={{ duration: 120, easing: 'ease' }}>
            {renderActiveDragOverlay()}
          </DragOverlay>
        </DndContext>
      )}

      <AddApplicationModal
        open={addOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveApplication}
        status={DEFAULT_NEW_APP_STATUS}
      />

      <DeleteApplicationModal
        open={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteConfirm}
        application={selectedApp}
      />
    </Box>
  );
}

ApplicationsListView.propTypes = {
  apps: PropTypes.arrayOf(APP_SHAPE).isRequired,
  onAdd: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onStatusChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default ApplicationsListView;

