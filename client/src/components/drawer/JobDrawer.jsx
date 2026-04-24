import PropTypes from 'prop-types';
import { Drawer } from '@mui/material';
import { drawerPaperSx } from './styles/jobDrawerContainerStyles';
import { appShape } from './helpers/propTypes';
import JobDrawerBody from './JobDrawerBody.jsx';

function JobDrawer({ open, app, onClose, onSaveNote, onSaveInterviewStatus, onSaveEdit }) {
  const stateKey = app?.id ?? 'empty-app';

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: drawerPaperSx } }}
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
