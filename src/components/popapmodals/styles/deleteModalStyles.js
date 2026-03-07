/**
 * Styles for DeleteApplicationModal component
 */

export const DELETE_MODAL = {
  dialog: {
    '& .MuiDialog-paper': {
      borderRadius: '12px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
    },
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    fontSize: '20px',
    fontWeight: 600,
    color: 'text.primary',
    pb: 1,
  },
  iconError: {
    color: '#C83737',
    fontSize: '28px',
  },
  content: {
    pt: 2,
  },
  contentText: {
    color: 'text.secondary',
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '1.6',
    mb: 2,
  },
  applicationInfo: {
    p: 2,
    borderRadius: '8px',
    backgroundColor: 'action.hover',
    border: '1px solid',
    borderColor: 'divider',
    mb: 2,
  },
  infoRow: {
    mb: 1,
    display: 'flex',
    alignItems: 'center',
    gap: 1,
  },
  infoLabel: {
    fontWeight: 600,
    color: 'text.primary',
  },
  infoValue: {
    color: 'text.primary',
    marginLeft: '8px',
  },
  warningText: {
    color: 'text.secondary',
    fontSize: '13px',
    fontWeight: 400,
    lineHeight: '1.5',
    fontStyle: 'italic',
  },
  actions: {
    p: 2,
    gap: 1,
    justifyContent: 'flex-end',
  },
  buttonCancel: {
    textTransform: 'none',
    fontSize: '14px',
    fontWeight: 500,
    color: 'text.primary',
    borderColor: 'divider',
    '&:hover': {
      backgroundColor: 'action.hover',
    },
  },
  buttonDelete: {
    textTransform: 'none',
    fontSize: '14px',
    fontWeight: 500,
    backgroundColor: '#C83737',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#A82828',
    },
    '&:disabled': {
      backgroundColor: '#E8B4B4',
      color: '#fff',
    },
  },
};
