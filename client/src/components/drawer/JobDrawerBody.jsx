import PropTypes from 'prop-types';
import { Box, Button, Divider } from '@mui/material';
import {
  ctaButtonSx,
  ctaWrapSx,
  dividerSx,
  drawerRootSx,
} from './styles/jobDrawerContainerStyles';
import useJobDrawerState from './hooks/useJobDrawerState';
import { appShape } from './helpers/propTypes';
import { getAppTags, getCompanyLink } from './helpers/jobDrawerMappers';
import EditFormContent from './sections/EditFormContent';
import JobDrawerHeader from './sections/JobDrawerHeader';
import JobDrawerDetails from './sections/JobDrawerDetails';
import JobDrawerNotes from './sections/JobDrawerNotes';

const toTagsArray = (rawTags = '') => rawTags
  .split(',')
  .map((tag) => tag.trim())
  .filter(Boolean);

const buildUpdatedApp = (app, editFormData) => {
  const nextJobTitle = editFormData.position.trim();
  const nextCompanyName = editFormData.company.trim();

  return {
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
    tags: toTagsArray(editFormData.tags),
  };
};

function JobDrawerBody({ app, onClose, onSaveNote, onSaveInterviewStatus, onSaveEdit }) {
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
    onSaveEdit(buildUpdatedApp(app, editFormData));
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

export default JobDrawerBody;

