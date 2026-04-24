/**
 * Styles for EditApplicationModal component
 */

export const EDIT_MODAL = {
  title: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    fontSize: '20px',
    fontWeight: 600,
    color: 'text.primary',
    pb: 1,
  },
  iconEdit: {
    color: '#2196F3',
    fontSize: '28px',
  },
  content: {
    pt: 2,
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
  buttonSave: {
    textTransform: 'none',
    fontSize: '14px',
    fontWeight: 500,
    backgroundColor: '#2196F3',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#1976D2',
    },
    '&:disabled': {
      backgroundColor: '#90CAF9',
      color: '#fff',
    },
  },
};
