import React, {useState} from 'react';
import PropTypes from 'prop-types';
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
import {
  ctaButtonSx,
  ctaWrapSx,
  drawerPaperSx,
  drawerRootSx,
  headerRowSx,
  historyEntrySx,
  historyStatusSx,
  historyTimeSx,
  iconMetaSx,
  labelSx,
  linkSx,
  logoSx,
  metaTextSx,
  notesInputSx,
  notesLabelSx,
  scrollSectionSx,
  sectionSx,
  sectionTitleSx,
  statusChipSx,
  tagChipSx,
  titleSx,
  titleWrapSx,
  valueSx,
} from './styles/jobDrawerStyles';

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

function JobDrawer({open, app, onClose, onSaveNote, onSaveInterviewStatus, onSaveEdit}) {
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

  // Track derived state to avoid useEffect synchronization issues
  const [prevAppId, setPrevAppId] = useState(null);
  const [prevOpen, setPrevOpen] = useState(open);

  if (open && app && app.id !== prevAppId) {
    setPrevAppId(app.id);
    setNoteValue(app?.note || app?.notes || '');
    setEditFormData({
      position: app?.position || app?.jobTitle || '',
      company: app?.company || app?.companyName || '',
      location: app?.location || '',
      workType: app?.workType || '',
      jobUrl: app?.jobUrl || app?.url || '',
      platform: app?.platform || '',
      tags: Array.isArray(app?.tags) ? app.tags.join(', ') : app?.tags || '',
    });
  }

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (!open) {
      setIsEditMode(false);
    }
  }

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
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{paper: {sx: drawerPaperSx}}}
    >
      <Box sx={drawerRootSx}>
        {/* Header */}
        <Box sx={sectionSx}>
          <Box sx={headerRowSx}>
            <Box sx={titleWrapSx}>
              <Box
                component="img"
                src={app?.companyLogo || '/src/assets/logo.svg'}
                alt={app?.company || app?.companyName || 'Company logo'}
                sx={logoSx}
              />
              <Box sx={{minWidth: 0}}>
                <Typography variant="subtitle1" sx={titleSx} noWrap>
                  {isEditMode ? editFormData.position : app?.position || app?.jobTitle || 'Untitled Role'}
                </Typography>
                <Chip
                  label={app?.status || 'Applied'}
                  size="small"
                  sx={statusChipSx}
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
          <Box sx={scrollSectionSx}>
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
            <Box sx={scrollSectionSx}>
              <Stack spacing={1.6}>
                <Box sx={{display: 'flex', gap: 1.5}}>
                  <LocationOnOutlinedIcon sx={iconMetaSx} />
                  <Box>
                    <Typography sx={labelSx}>Location</Typography>
                    <Typography sx={valueSx}>{app?.location || 'Tlv, IL'}</Typography>
                  </Box>
                </Box>

                <Box sx={{display: 'flex', gap: 1.5}}>
                  <WorkOutlineOutlinedIcon sx={iconMetaSx} />
                  <Box>
                    <Typography sx={labelSx}>Work Type</Typography>
                    <Typography sx={valueSx}>{app?.workType || 'Hybrid'}</Typography>
                  </Box>
                </Box>

                <Box sx={{display: 'flex', gap: 1.5}}>
                  <LinkOutlinedIcon sx={iconMetaSx} />
                  <Box sx={{minWidth: 0}}>
                    <Typography sx={labelSx}>Job URL</Typography>
                    <Typography
                      component={jobLink ? 'a' : 'span'}
                      href={jobLink || undefined}
                      target={jobLink ? '_blank' : undefined}
                      rel={jobLink ? 'noreferrer' : undefined}
                      sx={linkSx}
                    >
                      {jobLink || 'https://example.com/careers/developer'}
                    </Typography>
                  </Box>
                </Box>
              </Stack>

              <Typography sx={sectionTitleSx}>Tags</Typography>
              <Stack direction="row" useFlexGap flexWrap="wrap" spacing={1}>
                {(tags.length ? tags : ['Rest API', 'React', 'Node.js']).map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    sx={tagChipSx}
                  />
                ))}
              </Stack>

              <Typography sx={sectionTitleSx}>Extra Details</Typography>
              <Stack spacing={0.6}>
                <Typography sx={metaTextSx}>Created At: {getCreatedDate(app)}</Typography>
                <Typography sx={metaTextSx}>Applied At: {getAppliedDate(app)}</Typography>
                <Typography sx={metaTextSx}>Platform: {app?.platform || 'LinkedIn'}</Typography>
              </Stack>

              {app?.statusHistory && app.statusHistory.length > 0 && (
                <>
                  <Typography sx={sectionTitleSx}>Status History</Typography>
                  <Stack spacing={1}>
                    {app.statusHistory.map((entry, idx) => (
                      <Box key={`${entry.timestamp}-${idx}`} sx={historyEntrySx}>
                        <Typography sx={historyStatusSx}>{entry.status}</Typography>
                        <Typography sx={historyTimeSx}>
                          {new Date(entry.timestamp).toLocaleDateString()} at {new Date(entry.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </>
              )}
            </Box>

            {/* Notes Section */}
            <Box sx={sectionSx}>
              <Typography sx={notesLabelSx}>Notes</Typography>
              <TextField
                fullWidth
                multiline
                minRows={3}
                value={noteValue}
                onChange={(e) => setNoteValue(e.target.value)}
                placeholder="Add a note here...."
                sx={notesInputSx}
              />
              <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 0.8}}>
                <Button variant="outlined" size="small" onClick={handleSaveNote}>Save Notes</Button>
              </Box>
            </Box>
          </>
        )}

        {/* Bottom CTA */}
        {!isEditMode && (
          <Box sx={ctaWrapSx}>
            <Divider sx={{mb: 2}} />
            <Button
              fullWidth
              variant="contained"
              onClick={handleInterviewCta}
              sx={ctaButtonSx}
            >
              I have an Interview
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}

JobDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  app: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    position: PropTypes.string,
    jobTitle: PropTypes.string,
    company: PropTypes.string,
    companyName: PropTypes.string,
    companyLogo: PropTypes.string,
    location: PropTypes.string,
    workType: PropTypes.string,
    jobUrl: PropTypes.string,
    url: PropTypes.string,
    link: PropTypes.string,
    platform: PropTypes.string,
    status: PropTypes.string,
    note: PropTypes.string,
    notes: PropTypes.string,
    tags: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string)
    ]),
    skills: PropTypes.arrayOf(PropTypes.string),
    appliedAt: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
    createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
    updatedAt: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
    statusHistory: PropTypes.arrayOf(PropTypes.shape({
      status: PropTypes.string,
      timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)])
    }))
  }),
  onClose: PropTypes.func.isRequired,
  onSaveNote: PropTypes.func,
  onSaveInterviewStatus: PropTypes.func,
  onSaveEdit: PropTypes.func
};

export default JobDrawer;
