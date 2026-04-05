/**
 * ApplicationCard component
 * @param {{app: import('../../../types/Types.js').JobApplication, status?: import('../../../types/Types.js').JobStatus, draggableProps?: object, dragHandleProps?: object, innerRef?: any, onDelete?: function, onEdit?: function, onShare?: function}} props
 */

import React, { memo, useState } from 'react';
import { Box, Card, CardContent, Avatar, Chip, Stack, Typography, useTheme } from '@mui/material';
import { CARD, STATUS_GRADIENTS } from './styles/applicationCardStyles';

function ApplicationCard({
  app,
  status,
  draggableProps,
  dragHandleProps,
  innerRef,
  onOpen,
  onEdit,
  onRequestEdit,
  onRequestDelete,
  onShare,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
    if (onRequestDelete) {
      onRequestDelete(app);
    }
    setDropdownOpen(false);
  };

  const handleEditClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRequestEdit) {
      onRequestEdit(app);
    }
    setDropdownOpen(false);
  };

  const handleShareClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onShare) {
      await onShare(app);
    }
    setDropdownOpen(false);
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
            if (onOpen) {
              onOpen(app);
            } else if (onEdit) {
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
              onClick={handleShareClick}
              component="button"
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
              }}
            >
              <Box
                component="img"
                src="/src/assets/main section icons/si_link-duotone.svg"
                alt="Share"
                sx={{ width: 24, height: 24 }}
              />
              <Typography sx={CARD.menuItemText}>Share</Typography>
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

export default memo(ApplicationCard, (prevProps, nextProps) => {
  // Return true if props are equivalent (skip re-render)
  // Only re-render if the app data or key callbacks changed
  return (
    prevProps.app === nextProps.app &&
    prevProps.status === nextProps.status &&
    prevProps.onOpen === nextProps.onOpen &&
    prevProps.onRequestEdit === nextProps.onRequestEdit &&
    prevProps.onRequestDelete === nextProps.onRequestDelete &&
    prevProps.onShare === nextProps.onShare &&
    prevProps.draggableProps === nextProps.draggableProps &&
    prevProps.dragHandleProps === nextProps.dragHandleProps &&
    prevProps.innerRef === nextProps.innerRef
  );
});

