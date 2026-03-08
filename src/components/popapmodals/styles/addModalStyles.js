/**
 * Styles for AddApplicationModal component
 */

export const ADD_MODAL = {
  title: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    fontSize: '20px',
    fontWeight: 600,
    color: 'text.primary',
    pb: 1,
  },
  iconAdd: {
    color: '#4CAF50',
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
    backgroundColor: '#4CAF50',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#388E3C',
    },
    '&:disabled': {
      backgroundColor: '#A5D6A7',
      color: '#fff',
    },
  },
};
