import PropTypes from 'prop-types';
import {Box, Button, TextField, Typography} from '@mui/material';
import {
  notesInputSx,
  notesLabelSx,
  saveNotesButtonSx,
} from '../styles/jobDrawerNotesStyles';
import {sectionSx} from '../styles/jobDrawerSharedStyles';

export default function JobDrawerNotes({noteValue, onNoteChange, onSaveNote}) {
  return (
    <Box sx={sectionSx}>
      <Typography sx={notesLabelSx}>Notes</Typography>
      <TextField
        fullWidth
        multiline
        minRows={3}
        value={noteValue}
        onChange={onNoteChange}
        placeholder="Add a note here...."
        sx={notesInputSx}
      />
      <Box sx={saveNotesButtonSx}>
        <Button variant="outlined" size="small" onClick={onSaveNote}>Save Notes</Button>
      </Box>
    </Box>
  );
}

JobDrawerNotes.propTypes = {
  noteValue: PropTypes.string.isRequired,
  onNoteChange: PropTypes.func.isRequired,
  onSaveNote: PropTypes.func.isRequired,
};

