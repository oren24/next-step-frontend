/**
 * AddApplicationModal component
 * Displays a form to add a new job application
 * @param {{open: boolean, onClose: function, onSave: function, status?: string, isLoading?: boolean}} props
 */

import React, { useState } from 'react';
import {
  Autocomplete,
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
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { ADD_MODAL } from './styles/addModalStyles';
import { JOB_STATUSES } from '../../constants/jobStatuses.js';
import { WORK_TYPES } from '../../constants/workTypes.js';
import { mockTags } from '../../data/mockTags.js';


const MAX_TAGS = 5;

const normalizeTags = (tags) => {
  const seen = new Set();
  const unique = [];

  tags.forEach((tag) => {
    const trimmed = String(tag || '').trim();
    if (!trimmed) return;

    const key = trimmed.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    unique.push(trimmed);
  });

  return unique.slice(0, MAX_TAGS);
};

const createInitialFormData = (status) => ({
  companyName: '',
  jobTitle: '',
  location: '',
  workType: 'Remote',
  status,
  platform: '',
  appliedDate: new Date().toISOString().split('T')[0],
  notes: '',
  tags: [],
  jobUrl: '',
  nextInterviewDate: '',
  round: '',
  answerDeadline: '',
  offerAmount: '',
  offerCurrency: 'USD',
});

const AddApplicationModal = ({ open, onClose, onSave, status = 'Wishlist', isLoading = false }) => {
  const [formData, setFormData] = useState(() => createInitialFormData(status));

  const handleDialogEnter = () => {
    setFormData(createInitialFormData(status));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTagsChange = (_, nextTags) => {
    setFormData((prev) => ({
      ...prev,
      tags: normalizeTags(nextTags),
    }));
  };

  const handleSave = (asDraft = false) => {
    if (!onSave) return;

    const companyName = formData.companyName.trim();
    const jobTitle = formData.jobTitle.trim();

    if (!asDraft && (!companyName || !jobTitle)) return;

    const now = new Date().toISOString();
    const newApp = {
      id: `app_${Date.now()}`,
      ...formData,
      companyName,
      jobTitle,
      tags: normalizeTags(formData.tags),
      createdAt: now,
      updatedAt: now,
      isDraft: asDraft,
      draftSavedAt: asDraft ? now : null,
    };

    onSave(newApp);
  };

  const isFormValid = Boolean(formData.companyName.trim() && formData.jobTitle.trim());

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      TransitionProps={{ onEnter: handleDialogEnter }}
      PaperProps={{
        sx: {
          borderRadius: '12px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        },
      }}
    >
      <DialogTitle sx={ADD_MODAL.title}>
        <AddCircleIcon sx={ADD_MODAL.iconAdd} />
        Add New Application
      </DialogTitle>

      <DialogContent sx={ADD_MODAL.content}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          {/* Company and Job Title */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company Name *"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                size="small"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Job Title *"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                size="small"
                required
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
            <Autocomplete
              multiple
              freeSolo
              size="small"
              options={mockTags}
              value={formData.tags}
              onChange={handleTagsChange}
              filterSelectedOptions
              disabled={isLoading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tags"
                  placeholder={formData.tags.length >= MAX_TAGS ? 'Max 5 tags' : 'Add tags'}
                  helperText="Choose from suggestions or type your own tags (max 5)."
                />
              )}
            />
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

      <DialogActions sx={ADD_MODAL.actions}>
        <Button
          onClick={onClose}
          disabled={isLoading}
          sx={ADD_MODAL.buttonCancel}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={() => handleSave(true)}
          disabled={isLoading}
          variant="outlined"
        >
          Save as Draft
        </Button>
        <Button
          onClick={handleSave}
          disabled={!isFormValid || isLoading}
          sx={ADD_MODAL.buttonSave}
          variant="contained"
        >
          {isLoading ? 'Adding...' : 'Add Application'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddApplicationModal;
