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
import {
  JOB_STATUSES,
  STATUS_FILTERS,
  SORT_OPTIONS,
} from './listView.constants';
import { buildGroupedRows, buildRows } from './listView.utils';
import ListStatusSection from './ListStatusSection.jsx';

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

function ApplicationsListView({ apps, onAdd, onEdit, onDelete, onStatusChange }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [addOpen, setAddOpen] = useState(false);
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
    if (!appId || !nextStatus || !JOB_STATUSES.includes(nextStatus)) return;

    const activeApp = apps.find((app) => app.id === appId);
    if (!activeApp || activeApp.status === nextStatus) return;
    onStatusChange(appId, nextStatus);
  };

  const isDragging = activeId !== null;
  const activeApp = activeId ? apps.find((app) => app.id === activeId) : null;

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

      {rows.length === 0 ? (
        <Paper sx={LIST.emptyState}>No matching applications.</Paper>
      ) : (
        <DndContext
          sensors={sensors}
          onDragStart={(event) => setActiveId(event.active?.id ?? null)}
          onDragCancel={() => setActiveId(null)}
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
      )}

      <AddApplicationModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={(newApp) => {
          onAdd(newApp);
          setAddOpen(false);
        }}
        status="Wishlist"
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

ApplicationsListView.propTypes = {
  apps: PropTypes.arrayOf(APP_SHAPE).isRequired,
  onAdd: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onStatusChange: PropTypes.func.isRequired,
};

export default ApplicationsListView;

