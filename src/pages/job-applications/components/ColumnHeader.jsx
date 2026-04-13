import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import { BOARD } from '../../styles/jobApplicationsStyles.js';

export default function ColumnHeader({
  status,
  colors,
  isRejectedStatus,
  iconStyle,
  statusIcon,
  plusIconStyle,
  onAddClick,
}) {
  return (
    <Box
      sx={{
        ...BOARD.columnHeader,
        backgroundColor: colors.headerBg,
        borderColor: colors.header,
        '--header-color': colors.header,
        '--header-bg': colors.headerBg,
        '--card-bg': colors.cardBg,
        position: 'relative',
        ...BOARD.statusHeader,
      }}
    >
      {!isRejectedStatus && (
        <Box
          component="img"
          src={statusIcon}
          sx={{
            ...BOARD.baseStatusIcon,
            ...iconStyle,
          }}
        />
      )}

      <Typography
        variant="subtitle1"
        sx={{
          ...BOARD.columnTitle,
          ...BOARD.statusTitle,
          color: colors.header,
        }}
      >
        {status === 'Wishlist' ? 'Wishlist' : status}
      </Typography>

      <Box
        component="button"
        onClick={onAddClick}
        sx={{
          ...BOARD.basePlusIcon,
          ...plusIconStyle,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:hover': {
            opacity: 0.8,
          },
        }}
      >
        <Box
          component="img"
          src="/src/assets/main section icons/plus.svg"
          sx={{
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        />
      </Box>
    </Box>
  );
}

ColumnHeader.propTypes = {
  status: PropTypes.string.isRequired,
  colors: PropTypes.shape({
    header: PropTypes.string,
    headerBg: PropTypes.string,
    cardBg: PropTypes.string,
  }).isRequired,
  isRejectedStatus: PropTypes.bool,
  iconStyle: PropTypes.object,
  statusIcon: PropTypes.string,
  plusIconStyle: PropTypes.object,
  onAddClick: PropTypes.func.isRequired,
};
