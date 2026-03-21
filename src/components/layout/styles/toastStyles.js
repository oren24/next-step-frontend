export const TOAST = {
  snackbar: {
    top: { xs: 80, md: 96 },
    right: { xs: 12, md: 20 },
    left: 'auto',
    bottom: 'auto',
  },
  card: {
    minWidth: 260,
    maxWidth: 420,
    borderRadius: '12px',
    px: 1.5,
    py: 1.25,
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    border: '1px solid',
    borderColor: 'divider',
    color: 'text.primary',
    boxShadow: (theme) => theme.palette.toast.shadow,
    backgroundColor: (theme) => theme.palette.toast.surface,
  },
  icon: {
    width: 20,
    height: 20,
    flexShrink: 0,
  },
  message: {
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.35,
    flex: 1,
  },
  closeButton: {
    width: 24,
    height: 24,
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    borderRadius: '6px',
    p: 0,
    display: 'grid',
    placeItems: 'center',
    '&:hover': {
      backgroundColor: 'action.hover',
    },
  },
  closeIcon: {
    width: 16,
    height: 16,
    opacity: 0.75,
    filter: (theme) => theme.palette.toast.closeIconFilter,
  },
};

export const TOAST_SEVERITY = {
  success: {
    borderColor: (theme) => theme.palette.toast.success.border,
    backgroundColor: (theme) => theme.palette.toast.success.background,
  },
  warning: {
    borderColor: (theme) => theme.palette.toast.warning.border,
    backgroundColor: (theme) => theme.palette.toast.warning.background,
  },
  error: {
    borderColor: (theme) => theme.palette.toast.error.border,
    backgroundColor: (theme) => theme.palette.toast.error.background,
  },
};

