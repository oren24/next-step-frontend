import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import { BOARD, EMPTY_STATE_GRADIENTS } from '../../styles/jobApplicationsStyles.js';
import { getEmptyStateText } from '../utils/applicationHelpers.js';

export default function EmptyStateCard({ status, colors, iconStyle, statusIcon }) {
  return (
    <Box
      sx={{
        ...BOARD.emptyStateCard,
        borderColor: colors.header,
        background: EMPTY_STATE_GRADIENTS[status],
      }}
    >
      <Box
        component="img"
        src={statusIcon}
        sx={{
          ...BOARD.emptyStateIcon,
          filter: iconStyle?.filter,
        }}
      />
      <Typography
        sx={{
          ...BOARD.emptyStateText,
          color: colors.header,
        }}
      >
        {getEmptyStateText(status)}
      </Typography>
    </Box>
  );
}

EmptyStateCard.propTypes = {
  status: PropTypes.string.isRequired,
  colors: PropTypes.shape({
    header: PropTypes.string,
  }).isRequired,
  iconStyle: PropTypes.object,
  statusIcon: PropTypes.string,
};
