/**
 * DeleteApplicationModal component
 * Displays a confirmation dialog for deleting a job application
 * @param {{open: boolean, onClose: function, onConfirm: function, application?: import('../../types/Types.js').JobApplication, isLoading?: boolean}} props
 */

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import { DELETE_MODAL } from './styles/deleteModalStyles';

const DeleteApplicationModal = ({ open, onClose, onConfirm, application, isLoading = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(application?.id);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={DELETE_MODAL.dialog}
    >
      <DialogTitle sx={DELETE_MODAL.title}>
        <ErrorIcon sx={DELETE_MODAL.iconError} />
        Delete Application
      </DialogTitle>

      <DialogContent sx={DELETE_MODAL.content}>
        <DialogContentText sx={DELETE_MODAL.contentText}>
          Are you sure you want to delete this job application?
        </DialogContentText>

        {application && (
          <Box sx={DELETE_MODAL.applicationInfo}>
            <Box sx={DELETE_MODAL.infoRow}>
              <span style={{ fontWeight: 600, color: 'text.primary' }}>Company:</span>
              <span style={{ marginLeft: '8px', color: 'text.primary' }}>
                {application.companyName}
              </span>
            </Box>
            <Box>
              <span style={{ fontWeight: 600, color: 'text.primary' }}>Position:</span>
              <span style={{ marginLeft: '8px', color: 'text.primary' }}>
                {application.jobTitle}
              </span>
            </Box>
          </Box>
        )}

        <DialogContentText sx={DELETE_MODAL.warningText}>
          This action cannot be undone.
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={DELETE_MODAL.actions}>
        <Button
          onClick={onClose}
          disabled={isLoading}
          sx={DELETE_MODAL.buttonCancel}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={isLoading}
          loading={isLoading}
          sx={DELETE_MODAL.buttonDelete}
          variant="contained"
        >
          {isLoading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteApplicationModal;
