import React, {useEffect, useState} from 'react';
import {
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

const getAppTags = (app) => {
  if (!app) return [];
  if (Array.isArray(app.tags)) return app.tags;
  if (Array.isArray(app.skills)) return app.skills;
  if (typeof app.tags === 'string') return app.tags.split(',').map((t) => t.trim()).filter(Boolean);
  return [];
};

const getCompanyLink = (app) => {
  if (!app) return '';
  return app.url || app.jobUrl || app.link || '';
};

const getAppliedDate = (app) => {
  if (!app) return '-';
  const value = app.appliedAt || app.createdAt || app.updatedAt;
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'});
};

const getCreatedDate = (app) => {
  if (!app) return '-';
  const value = app.createdAt;
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'});
};

export default function JobDrawer({open, app, onClose, onSaveNote, onSaveInterviewStatus, onSaveEdit}) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [noteValue, setNoteValue] = useState('');
  const [editFormData, setEditFormData] = useState({
    position: '',
    company: '',
    location: '',
    workType: '',
    jobUrl: '',
    platform: '',
    tags: '',
  });

  useEffect(() => {
    if (open) {
      setNoteValue(app?.note || app?.notes || '');
      setEditFormData({
        position: app?.position || '',
        company: app?.company || '',
        location: app?.location || '',
        workType: app?.workType || '',
        jobUrl: app?.jobUrl || app?.url || '',
        platform: app?.platform || '',
        tags: Array.isArray(app?.tags) ? app.tags.join(', ') : app?.tags || '',
      });
    }
  }, [app, open]);

  useEffect(() => {
    if (!open) {
      setIsEditMode(false);
    }
  }, [open]);

  const handleSaveNote = () => {
    if (!app || !onSaveNote) return;
    onSaveNote(app.id, noteValue);
  };

  const handleInterviewCta = () => {
    if (!app || !onSaveInterviewStatus) return;
    onSaveInterviewStatus(app.id);
  };

  const handleEditModeToggle = () => {
    setIsEditMode(!isEditMode);
  };

  const handleFormChange = (e) => {
    const {name, value} = e.target;
    setEditFormData((prev) => ({...prev, [name]: value}));
  };

  const handleSaveEdit = () => {
    if (!app || !onSaveEdit) return;
    const tagsArray = editFormData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const updatedApp = {
      ...app,
      position: editFormData.position,
      company: editFormData.company,
      location: editFormData.location,
      workType: editFormData.workType,
      jobUrl: editFormData.jobUrl,
      platform: editFormData.platform,
      tags: tagsArray,
    };

    onSaveEdit(updatedApp);
    setIsEditMode(false);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditFormData({
      position: app?.position || '',
      company: app?.company || '',
      location: app?.location || '',
      workType: app?.workType || '',
      jobUrl: app?.jobUrl || app?.url || '',
      platform: app?.platform || '',
      tags: Array.isArray(app?.tags) ? app.tags.join(', ') : app?.tags || '',
    });
  };

  const tags = getAppTags(app);
  const jobLink = getCompanyLink(app);

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{sx: {width: {xs: '100%', sm: 420}}}}>
      <Box sx={{height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#fff'}}>
        {/* Header */}
        <Box sx={{p: 2.5, borderBottom: '1px solid #e6e6e6'}}>
          <Box sx={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.5}}>
            <Box sx={{display: 'flex', gap: 1.5, minWidth: 0}}>
              <Box
                component="img"
                src={app?.companyLogo || '/src/assets/logo.svg'}
                alt={app?.company || 'Company logo'}
                sx={{width: 34, height: 34, borderRadius: 1, objectFit: 'cover'}}
              />
              <Box sx={{minWidth: 0}}>
                <Typography variant="subtitle1" sx={{fontWeight: 700, lineHeight: 1.2}} noWrap>
                  {isEditMode ? editFormData.position : app?.position || 'Untitled Role'}
                </Typography>
                <Chip
                  label={app?.status || 'Applied'}
                  size="small"
                  sx={{mt: 1, height: 22, borderRadius: 99, bgcolor: '#fde8ea', color: '#cb3f4b', fontSize: 11}}
                />
              </Box>
            </Box>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
              {!isEditMode && (
                <IconButton size="small" aria-label="Edit job" onClick={handleEditModeToggle}>
                  <EditIcon fontSize="small" />
                </IconButton>
              )}
              <IconButton size="small" aria-label="Close drawer" onClick={onClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Edit Mode Form */}
        {isEditMode ? (
          <Box sx={{p: 2.5, borderBottom: '1px solid #e6e6e6', overflowY: 'auto', flex: 1}}>
            <Stack spacing={2}>
              <TextField
                label="Position"
                name="position"
                value={editFormData.position}
                onChange={handleFormChange}
                fullWidth
                size="small"
              />
              <TextField
                label="Company"
                name="company"
                value={editFormData.company}
                onChange={handleFormChange}
                fullWidth
                size="small"
              />
              <TextField
                label="Location"
                name="location"
                value={editFormData.location}
                onChange={handleFormChange}
                fullWidth
                size="small"
              />
              <TextField
                label="Work Type"
                name="workType"
                value={editFormData.workType}
                onChange={handleFormChange}
                fullWidth
                size="small"
              />
              <TextField
                label="Job URL"
                name="jobUrl"
                value={editFormData.jobUrl}
                onChange={handleFormChange}
                fullWidth
                size="small"
              />
              <TextField
                label="Platform"
                name="platform"
                value={editFormData.platform}
                onChange={handleFormChange}
                fullWidth
                size="small"
              />
              <TextField
                label="Tags (comma-separated)"
                name="tags"
                value={editFormData.tags}
                onChange={handleFormChange}
                fullWidth
                size="small"
                multiline
                minRows={2}
              />
            </Stack>

            <Box sx={{display: 'flex', gap: 1, mt: 3, justifyContent: 'flex-end'}}>
              <Button variant="outlined" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSaveEdit}>
                Save
              </Button>
            </Box>
          </Box>
        ) : (
          <>
            {/* View Mode Content */}
            <Box sx={{p: 2.5, borderBottom: '1px solid #e6e6e6', overflowY: 'auto', flex: 1}}>
              <Stack spacing={1.6}>
                <Box sx={{display: 'flex', gap: 1.5}}>
                  <LocationOnOutlinedIcon sx={{fontSize: 20, color: '#5f6368', mt: 0.2}} />
                  <Box>
                    <Typography sx={{fontSize: 13, fontWeight: 600}}>Location</Typography>
                    <Typography sx={{fontSize: 13, color: '#5f6368'}}>{app?.location || 'Tlv, IL'}</Typography>
                  </Box>
                </Box>

                <Box sx={{display: 'flex', gap: 1.5}}>
                  <WorkOutlineOutlinedIcon sx={{fontSize: 20, color: '#5f6368', mt: 0.2}} />
                  <Box>
                    <Typography sx={{fontSize: 13, fontWeight: 600}}>Work Type</Typography>
                    <Typography sx={{fontSize: 13, color: '#5f6368'}}>{app?.workType || 'Hybrid'}</Typography>
                  </Box>
                </Box>

                <Box sx={{display: 'flex', gap: 1.5}}>
                  <LinkOutlinedIcon sx={{fontSize: 20, color: '#5f6368', mt: 0.2}} />
                  <Box sx={{minWidth: 0}}>
                    <Typography sx={{fontSize: 13, fontWeight: 600}}>Job URL</Typography>
                    <Typography
                      component={jobLink ? 'a' : 'span'}
                      href={jobLink || undefined}
                      target={jobLink ? '_blank' : undefined}
                      rel={jobLink ? 'noreferrer' : undefined}
                      sx={{fontSize: 13, color: '#3b82f6', textDecoration: 'none', wordBreak: 'break-all'}}
                    >
                      {jobLink || 'https://example.com/careers/developer'}
                    </Typography>
                  </Box>
                </Box>
              </Stack>

              <Typography sx={{mt: 2.5, mb: 1.25, fontWeight: 700}}>Tags</Typography>
              <Stack direction="row" useFlexGap flexWrap="wrap" spacing={1}>
                {(tags.length ? tags : ['Rest API', 'React', 'Node.js']).map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    sx={{height: 24, borderRadius: 99, bgcolor: '#f8eaea', color: '#5f6368', fontSize: 12}}
                  />
                ))}
              </Stack>

              <Typography sx={{mt: 2.5, mb: 1.25, fontWeight: 700}}>Extra Details</Typography>
              <Stack spacing={0.6}>
                <Typography sx={{fontSize: 13}}>Created At: {getCreatedDate(app)}</Typography>
                <Typography sx={{fontSize: 13}}>Applied At: {getAppliedDate(app)}</Typography>
                <Typography sx={{fontSize: 13}}>Platform: {app?.platform || 'LinkedIn'}</Typography>
              </Stack>

              {app?.statusHistory && app.statusHistory.length > 0 && (
                <>
                  <Typography sx={{mt: 2.5, mb: 1.25, fontWeight: 700}}>Status History</Typography>
                  <Stack spacing={1}>
                    {app.statusHistory.map((entry, idx) => (
                      <Box key={idx} sx={{p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1}}>
                        <Typography sx={{fontSize: 12, fontWeight: 600}}>{entry.status}</Typography>
                        <Typography sx={{fontSize: 11, color: '#5f6368'}}>
                          {new Date(entry.timestamp).toLocaleDateString()} at {new Date(entry.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </>
              )}
            </Box>

            {/* Notes Section */}
            <Box sx={{p: 2.5, borderBottom: '1px solid #e6e6e6'}}>
              <Typography sx={{mb: 1, fontSize: 13, color: '#5f6368'}}>Notes</Typography>
              <TextField
                fullWidth
                multiline
                minRows={3}
                value={noteValue}
                onChange={(e) => setNoteValue(e.target.value)}
                placeholder="Add a note here...."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#fafafa',
                  },
                }}
              />
              <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 0.8}}>
                <Button variant="outlined" size="small" onClick={handleSaveNote}>Save Notes</Button>
              </Box>
            </Box>
          </>
        )}

        {/* Bottom CTA */}
        {!isEditMode && (
          <Box sx={{mt: 'auto', p: 2.5}}>
            <Divider sx={{mb: 2}} />
            <Button
              fullWidth
              variant="contained"
              onClick={handleInterviewCta}
              sx={{
                textTransform: 'none',
                borderRadius: 1.5,
                background: 'linear-gradient(180deg, #5db3ff 0%, #2f87dd 100%)',
              }}
            >
              I have an Interview
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
