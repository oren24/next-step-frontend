import PropTypes from 'prop-types';
import SaveIcon from '@mui/icons-material/Save';
import {Box, Button, Stack, TextField} from '@mui/material';
import {editFormButtonsSx} from '../styles/editFormContentStyles';
import {scrollSectionSx} from '../styles/jobDrawerSharedStyles';
import {editFormDataShape} from '../helpers/propTypes';

export default function EditFormContent({
  editFormData,
  onFormChange,
  onSaveEdit,
  onCancelEdit,
}) {
  return (
    <Box sx={scrollSectionSx}>
      <Stack spacing={2}>
        <TextField label="Position" name="position" value={editFormData.position} onChange={onFormChange} fullWidth size="small" />
        <TextField label="Company" name="company" value={editFormData.company} onChange={onFormChange} fullWidth size="small" />
        <TextField label="Location" name="location" value={editFormData.location} onChange={onFormChange} fullWidth size="small" />
        <TextField label="Work Type" name="workType" value={editFormData.workType} onChange={onFormChange} fullWidth size="small" />
        <TextField label="Job URL" name="jobUrl" value={editFormData.jobUrl} onChange={onFormChange} fullWidth size="small" />
        <TextField label="Platform" name="platform" value={editFormData.platform} onChange={onFormChange} fullWidth size="small" />
        <TextField
          label="Tags (comma-separated)"
          name="tags"
          value={editFormData.tags}
          onChange={onFormChange}
          fullWidth
          size="small"
          multiline
          minRows={2}
        />
      </Stack>

      <Box sx={editFormButtonsSx}>
        <Button variant="outlined" onClick={onCancelEdit}>Cancel</Button>
        <Button variant="contained" startIcon={<SaveIcon />} onClick={onSaveEdit}>Save</Button>
      </Box>
    </Box>
  );
}

EditFormContent.propTypes = {
  editFormData: editFormDataShape.isRequired,
  onFormChange: PropTypes.func.isRequired,
  onSaveEdit: PropTypes.func.isRequired,
  onCancelEdit: PropTypes.func.isRequired,
};

