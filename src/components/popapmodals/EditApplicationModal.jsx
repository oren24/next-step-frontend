/**
 * EditApplicationModal component
 * Displays a form to edit a job application
 * @param {{open: boolean, onClose: function, onSave: function, application?: import('../../types/Types.js').JobApplication, isLoading?: boolean}} props
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  useTheme,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { EDIT_MODAL } from './styles/editModalStyles';

const WORK_TYPES = ['Remote', 'On site', 'Hybrid'];
const JOB_STATUSES = ['Wishlist', 'Applied', 'Interviewing', 'Offer', 'Rejected'];

const EditApplicationModal = ({ open, onClose, onSave, application, isLoading = false }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    location: '',
    workType: 'Remote',
    status: 'Wishlist',
    platform: '',
    appliedDate: '',
    notes: '',
    tags: [],
    jobUrl: '',
    nextInterviewDate: '',
    round: '',
    answerDeadline: '',
    offerAmount: '',
    offerCurrency: 'USD',
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (application && open) {
      const newFormData = {
        companyName: application.companyName || '',
        jobTitle: application.jobTitle || '',
        location: application.location || '',
        workType: application.workType || 'Remote',
        status: application.status || 'Wishlist',
        platform: application.platform || '',
        appliedDate: application.appliedDate ? application.appliedDate.split('T')[0] : '',
        notes: application.notes || '',
        tags: application.tags || [],
        jobUrl: application.jobUrl || '',
        nextInterviewDate: application.nextInterviewDate ? application.nextInterviewDate.split('T')[0] : '',
        round: application.round || '',
        answerDeadline: application.answerDeadline ? application.answerDeadline.split('T')[0] : '',
        offerAmount: application.offerAmount || '',
        offerCurrency: application.offerCurrency || 'USD',
      };
      setFormData(newFormData);
      setTagInput('');
    }
  }, [application?.id, open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && formData.tags.length < 5) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSave = () => {
    if (onSave && application) {
      onSave({
        ...application,
        ...formData,
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        },
      }}
    >
      <DialogTitle sx={EDIT_MODAL.title}>
        <EditIcon sx={EDIT_MODAL.iconEdit} />
        Edit Application
      </DialogTitle>

      <DialogContent sx={EDIT_MODAL.content}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          {/* Company and Job Title */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Job Title"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                size="small"
              />
            </Grid>
          </Grid>

          {/* Work Type and Status */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Work Type</InputLabel>
                <Select
                  name="workType"
                  value={formData.workType}
                  onChange={handleInputChange}
                  label="Work Type"
                >
                  {WORK_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  label="Status"
                >
                  {JOB_STATUSES.map((stat) => (
                    <MenuItem key={stat} value={stat}>
                      {stat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Dates and Platform */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Platform (e.g., LinkedIn)"
                name="platform"
                value={formData.platform}
                onChange={handleInputChange}
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Applied Date"
                name="appliedDate"
                type="date"
                value={formData.appliedDate}
                onChange={handleInputChange}
                size="small"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Job URL"
                name="jobUrl"
                type="url"
                value={formData.jobUrl}
                onChange={handleInputChange}
                size="small"
              />
            </Grid>
          </Grid>

          {/* Tags */}
          <Box>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                size="small"
                placeholder="Add tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                disabled={formData.tags.length >= 5}
                sx={{ flex: 1 }}
              />
              <Button
                onClick={handleAddTag}
                disabled={!tagInput.trim() || formData.tags.length >= 5}
                size="small"
              >
                Add
              </Button>
            </Box>
            {formData.tags.length > 0 && (
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                {formData.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => handleRemoveTag(index)}
                    size="small"
                  />
                ))}
              </Stack>
            )}
          </Box>

          {/* Interview and Offer Details */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Interview Round"
                name="round"
                value={formData.round}
                onChange={handleInputChange}
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Next Interview Date"
                name="nextInterviewDate"
                type="date"
                value={formData.nextInterviewDate}
                onChange={handleInputChange}
                size="small"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Answer Deadline"
                name="answerDeadline"
                type="date"
                value={formData.answerDeadline}
                onChange={handleInputChange}
                size="small"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          {/* Offer Details */}
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <TextField
                fullWidth
                label="Offer Amount"
                name="offerAmount"
                type="number"
                value={formData.offerAmount}
                onChange={handleInputChange}
                size="small"
              />
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Currency</InputLabel>
                <Select
                  name="offerCurrency"
                  value={formData.offerCurrency}
                  onChange={handleInputChange}
                  label="Currency"
                >
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                  <MenuItem value="GBP">GBP</MenuItem>
                  <MenuItem value="ILS">ILS</MenuItem>
                  <MenuItem value="CAD">CAD</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Notes */}
          <TextField
            fullWidth
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            multiline
            rows={3}
            size="small"
          />
        </Box>
      </DialogContent>

      <DialogActions sx={EDIT_MODAL.actions}>
        <Button
          onClick={onClose}
          disabled={isLoading}
          sx={EDIT_MODAL.buttonCancel}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={isLoading}
          sx={EDIT_MODAL.buttonSave}
          variant="contained"
        >
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditApplicationModal;
