/**
 * ApplicationCard component
 * @param {{app: import('../../../types/Types.js').JobApplication, status?: import('../../../types/Types.js').JobStatus, draggableProps?: object, dragHandleProps?: object, innerRef?: any, onDelete?: function, onEdit?: function}} props
 */

import React, { useState } from 'react';
import { Box, Card, CardContent, Avatar, Chip, Stack, Typography, useTheme } from '@mui/material';
import { CARD, STATUS_GRADIENTS } from './styles/applicationCardStyles';
import DeleteApplicationModal from '../popapmodals/DeleteApplicationModal';
import EditApplicationModal from '../popapmodals/EditApplicationModal';

export default function ApplicationCard({ app, status, draggableProps, dragHandleProps, innerRef, onDelete, onEdit }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const statusGradient = STATUS_GRADIENTS[isDarkMode ? 'dark' : 'light'][status];
  const cardStyle = statusGradient
    ? {
        ...CARD.rootWithGradient,
        background: statusGradient,
      }
    : CARD.root;

  const handleMenuToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };

  const handleMenuClose = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setDropdownOpen(false);
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteModalOpen(true);
    setDropdownOpen(false);
  };

  const handleDeleteConfirm = async (applicationId) => {
    setIsDeleting(true);
    try {
      if (onDelete) {
        await onDelete(applicationId);
      }
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
  };

  const handleEditClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setEditModalOpen(true);
    setDropdownOpen(false);
  };

  const handleEditCancel = () => {
    setEditModalOpen(false);
  };

  const handleEditSave = async (updatedApp) => {
    setIsEditing(true);
    try {
      if (onEdit) {
        await onEdit(updatedApp);
      }
    } finally {
      setIsEditing(false);
      setEditModalOpen(false);
    }
  };

  return (
    <>
      {/* Backdrop to close dropdown when clicking outside */}
      {dropdownOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
            pointerEvents: 'auto',
          }}
          onClick={(e) => handleMenuClose(e)}
        />
      )}
      
      <Card
        variant="outlined"
        sx={dropdownOpen ? {
          ...cardStyle,
          '&:hover': {
            boxShadow: cardStyle.boxShadow || '0 4px 12px rgba(0,0,0,0.08)',
            transform: 'none',
          },
          cursor: 'default',
        } : {...cardStyle, cursor: 'pointer'}}
        ref={innerRef}
        {...(dropdownOpen ? {} : draggableProps)}
        {...(dropdownOpen ? {} : dragHandleProps)}
        onClick={(e) => {
          if (!dropdownOpen && !e.target.closest('button')) {
            if (onEdit) {
              onEdit(app);
            }
          }
        }}
      >
        {/* Custom header with absolute positioning */}
        <Box sx={CARD.header}>
          <Avatar src={app.companyLogo} alt={app.companyName} sx={CARD.avatar} />
          <Box sx={CARD.titleContainer}>
            <Typography variant="subtitle1" sx={CARD.title}>{app.companyName}</Typography>
            <Typography variant="body2" sx={CARD.subheader}>
              {app.jobTitle}{app.location ? `, ${app.location}` : ''}
            </Typography>
          </Box>
        </Box>
        
        {/* Three dots menu button */}
        <Box
          component="button"
          onClick={handleMenuToggle}
          className={dropdownOpen ? 'active' : ''}
          sx={CARD.menuButton}
        >
          <Box
            component="img"
            src="/src/assets/card application icons/three-dots.svg"
            alt="Menu"
            sx={{ width: 16, height: 16, pointerEvents: 'none' }}
          />
        </Box>

        {/* Dropdown menu */}
        {dropdownOpen && (
          <Box sx={CARD.dropdownMenu}>
            <Box
              sx={CARD.interactiveMenuItem}
              onClick={handleEditClick}
              component="button"
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
              }}
            >
              <Box
                component="img"
                src="/src/assets/card application icons/edit.svg"
                alt="Edit"
                sx={{ width: 24, height: 24 }}
              />
              <Typography sx={CARD.menuItemText}>Edit</Typography>
            </Box>
            
            <Box sx={CARD.menuItem}>
              <Box
                component="img"
                src="/src/assets/card application icons/move-to.svg"
                alt="Move To"
                sx={{ width: 24, height: 24 }}
              />
              <Typography sx={CARD.menuItemText}>Move To...</Typography>
            </Box>
            
            <Box
              sx={CARD.interactiveMenuItem}
              onClick={handleDeleteClick}
              component="button"
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
              }}
            >
              <Box
                component="img"
                src="/src/assets/card application icons/delete.svg"
                alt="Delete"
                sx={{ width: 24, height: 24 }}
              />
              <Typography sx={CARD.deletemenuItemText}>Delete</Typography>
            </Box>
          </Box>
        )}

        {/* Delete Modal */}
        <DeleteApplicationModal
          open={deleteModalOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          application={app}
          isLoading={isDeleting}
        />

        {/* Edit Modal */}
        <EditApplicationModal
          open={editModalOpen}
          onClose={handleEditCancel}
          onSave={handleEditSave}
          application={app}
          isLoading={isEditing}
        />

        <CardContent sx={CARD.content}>
          <Stack direction="row" sx={CARD.chipRow}>
            {(app.tags || []).slice(0, 5).map((t) => (
              <Chip key={t} label={t} size="small" sx={CARD.tag} />
            ))}
          </Stack>
          <Box sx={CARD.metaRow}>
            <Typography variant="caption" sx={CARD.metaText}>{app.platform || ''}</Typography>
            <Typography variant="caption" sx={CARD.metaText}>{app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : ''}</Typography>
          </Box>
        </CardContent>
      </Card>
    </>
  );
}
