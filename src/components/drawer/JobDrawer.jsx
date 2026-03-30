import PropTypes from 'prop-types';
import {Box, Button, Divider, Drawer} from '@mui/material';
import {
  ctaButtonSx,
  ctaWrapSx,
  dividerSx,
  drawerPaperSx,
  drawerRootSx,
} from './styles/jobDrawerContainerStyles';
import useJobDrawerState from './hooks/useJobDrawerState';
import {appShape} from './helpers/propTypes';
import {getAppTags, getCompanyLink} from './helpers/jobDrawerMappers';
import EditFormContent from './sections/EditFormContent';
import JobDrawerHeader from './sections/JobDrawerHeader';
import JobDrawerDetails from './sections/JobDrawerDetails';
import JobDrawerNotes from './sections/JobDrawerNotes';

function JobDrawerBody({app, onClose, onSaveNote, onSaveInterviewStatus, onSaveEdit}) {
  const {
    isEditMode,
    noteValue,
    editFormData,
    setIsEditMode,
    setNoteValue,
    handleToggleEditMode,
    handleFormChange,
    handleCancelEdit,
  } = useJobDrawerState(app);

  const handleSaveNote = () => {
    if (!app || !onSaveNote) return;
    onSaveNote(app.id, noteValue);
  };

  const handleInterviewCta = () => {
    if (!app || !onSaveInterviewStatus) return;
    onSaveInterviewStatus(app.id);
  };

  const handleSaveEdit = () => {
    if (!app || !onSaveEdit) return;
    const nextJobTitle = editFormData.position.trim();
    const nextCompanyName = editFormData.company.trim();
    const tagsArray = editFormData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const updatedApp = {
      ...app,
      // Keep canonical + legacy aliases in sync until legacy reads are removed.
      jobTitle: nextJobTitle,
      position: nextJobTitle,
      companyName: nextCompanyName,
      company: nextCompanyName,
      location: editFormData.location,
      workType: editFormData.workType,
      jobUrl: editFormData.jobUrl,
      platform: editFormData.platform,
      tags: tagsArray,
    };

    onSaveEdit(updatedApp);
    setIsEditMode(false);
  };

  const tags = getAppTags(app);
  const jobLink = getCompanyLink(app);
  const titleText = isEditMode
    ? editFormData.position
    : app?.position || app?.jobTitle || 'Untitled Role';

  return (
    <Box sx={drawerRootSx}>
      <JobDrawerHeader
        app={app}
        isEditMode={isEditMode}
        titleText={titleText}
        onToggleEditMode={handleToggleEditMode}
        onClose={onClose}
      />

        {isEditMode ? (
          <EditFormContent
            editFormData={editFormData}
            onFormChange={handleFormChange}
            onSaveEdit={handleSaveEdit}
            onCancelEdit={handleCancelEdit}
          />
        ) : (
          <>
            <JobDrawerDetails app={app} tags={tags} jobLink={jobLink} />
            <JobDrawerNotes
              noteValue={noteValue}
              onNoteChange={(event) => setNoteValue(event.target.value)}
              onSaveNote={handleSaveNote}
            />
          </>
        )}

      {!isEditMode && (
        <Box sx={ctaWrapSx}>
          <Divider sx={dividerSx} />
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
  );
}

JobDrawerBody.propTypes = {
  app: appShape,
  onClose: PropTypes.func.isRequired,
  onSaveNote: PropTypes.func,
  onSaveInterviewStatus: PropTypes.func,
  onSaveEdit: PropTypes.func,
};

function JobDrawer({open, app, onClose, onSaveNote, onSaveInterviewStatus, onSaveEdit}) {
  const stateKey = app?.id ?? 'empty-app';

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{paper: {sx: drawerPaperSx}}}
    >
      {open && (
        <JobDrawerBody
          key={stateKey}
          app={app}
          onClose={onClose}
          onSaveNote={onSaveNote}
          onSaveInterviewStatus={onSaveInterviewStatus}
          onSaveEdit={onSaveEdit}
        />
      )}
    </Drawer>
  );
}

JobDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  app: appShape,
  onClose: PropTypes.func.isRequired,
  onSaveNote: PropTypes.func,
  onSaveInterviewStatus: PropTypes.func,
  onSaveEdit: PropTypes.func,
};

export default JobDrawer;
