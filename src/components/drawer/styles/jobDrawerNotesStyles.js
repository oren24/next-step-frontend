export const notesLabelSx = (theme) => ({
  mb: 1,
  fontSize: 13,
  color: theme.palette.text.secondary,
});

export const notesInputSx = (theme) => ({
  '& .MuiOutlinedInput-root': {
    bgcolor: theme.palette.mode === 'dark' ? theme.palette.background.default : '#fafafa',
    color: theme.palette.text.primary,
    '& textarea::placeholder': {
      color: theme.palette.text.secondary,
      opacity: 1,
    },
  },
});

export const saveNotesButtonSx = {
  display: 'flex',
  justifyContent: 'flex-end',
  mt: 0.8,
};

