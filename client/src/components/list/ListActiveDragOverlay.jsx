import PropTypes from 'prop-types';
import { Box, Paper, Typography } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { LIST } from '../../pages/styles/jobApplicationsStyles';

export default function ListActiveDragOverlay({ activeApp }) {
  if (!activeApp) return null;

  return (
    <Paper sx={LIST.listDragOverlay}>
      <DragIndicatorIcon fontSize="small" sx={{ color: 'text.secondary', flexShrink: 0 }} />
      <Box>
        <Typography sx={{ fontWeight: 700, fontSize: '14px', lineHeight: 1.2 }}>
          {activeApp.companyName}
        </Typography>
        <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
          {activeApp.jobTitle}
        </Typography>
      </Box>
    </Paper>
  );
}

ListActiveDragOverlay.propTypes = {
  activeApp: PropTypes.shape({
    companyName: PropTypes.string,
    jobTitle: PropTypes.string,
  }),
};

