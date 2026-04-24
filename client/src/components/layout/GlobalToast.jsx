import PropTypes from 'prop-types';
import { Box, Paper, Snackbar, Typography } from '@mui/material';
import { TOAST, TOAST_SEVERITY } from './styles/toastStyles';

const ICON_BY_SEVERITY = {
  success: '/src/assets/toasts icons/lets-icons_check-fill.svg',
  warning: '/src/assets/toasts icons/mdi-light_alert.svg',
  error: '/src/assets/toasts icons/ix_error-filled.svg',
};

const CLOSE_ICON = '/src/assets/toasts icons/material-symbols-light_close.svg';

export default function GlobalToast({ open, message, severity, onClose }) {
  const severityStyle = TOAST_SEVERITY[severity] || TOAST_SEVERITY.success;
  const iconSrc = ICON_BY_SEVERITY[severity] || ICON_BY_SEVERITY.success;

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={TOAST.snackbar}
    >
      <Paper sx={{ ...TOAST.card, ...severityStyle }}>
        <Box component="img" src={iconSrc} alt={severity} sx={TOAST.icon} />
        <Typography sx={TOAST.message}>{message}</Typography>
        <Box component="button" type="button" onClick={onClose} sx={TOAST.closeButton}>
          <Box component="img" src={CLOSE_ICON} alt="Close" sx={TOAST.closeIcon} />
        </Box>
      </Paper>
    </Snackbar>
  );
}

GlobalToast.propTypes = {
  open: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  severity: PropTypes.oneOf(['success', 'warning', 'error']).isRequired,
  onClose: PropTypes.func.isRequired,
};

