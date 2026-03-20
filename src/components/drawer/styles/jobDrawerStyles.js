export const drawerPaperSx = {
  width: {xs: '100%', sm: 420},
};

export const drawerRootSx = (theme) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  bgcolor: theme.palette.background.paper,
  color: theme.palette.text.primary,
});

export const sectionSx = (theme) => ({
  p: 2.5,
  borderBottom: `1px solid ${theme.palette.divider}`,
});

export const scrollSectionSx = (theme) => ({
  ...sectionSx(theme),
  overflowY: 'auto',
  flex: 1,
});

export const headerRowSx = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: 1.5,
};

export const titleWrapSx = {
  display: 'flex',
  gap: 1.5,
  minWidth: 0,
};

export const logoSx = {
  width: 34,
  height: 34,
  borderRadius: 1,
  objectFit: 'cover',
};

export const titleSx = {
  fontWeight: 700,
  lineHeight: 1.2,
};

export const statusChipSx = (theme) => ({
  mt: 1,
  height: 22,
  borderRadius: 99,
  bgcolor: theme.palette.mode === 'dark' ? 'rgba(244,67,54,0.22)' : '#fde8ea',
  color: theme.palette.error.main,
  fontSize: 11,
});

export const iconMetaSx = (theme) => ({
  fontSize: 20,
  color: theme.palette.text.secondary,
  mt: 0.2,
});

export const labelSx = {
  fontSize: 13,
  fontWeight: 600,
};

export const valueSx = (theme) => ({
  fontSize: 13,
  color: theme.palette.text.secondary,
});

export const linkSx = (theme) => ({
  fontSize: 13,
  color: theme.palette.primary.main,
  textDecoration: 'none',
  wordBreak: 'break-all',
});

export const sectionTitleSx = {
  mt: 2.5,
  mb: 1.25,
  fontWeight: 700,
};

export const tagChipSx = (theme) => ({
  height: 24,
  borderRadius: 99,
  bgcolor: theme.palette.mode === 'dark' ? theme.palette.action.hover : '#f8eaea',
  color: theme.palette.text.secondary,
  fontSize: 12,
});

export const metaTextSx = {
  fontSize: 13,
};

export const historyEntrySx = (theme) => ({
  p: 1.5,
  bgcolor: theme.palette.action.hover,
  borderRadius: 1,
});

export const historyStatusSx = {
  fontSize: 12,
  fontWeight: 600,
};

export const historyTimeSx = (theme) => ({
  fontSize: 11,
  color: theme.palette.text.secondary,
});

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

export const ctaWrapSx = {
  mt: 'auto',
  p: 2.5,
};

export const ctaButtonSx = {
  textTransform: 'none',
  borderRadius: 1.5,
  background: 'linear-gradient(180deg, #5db3ff 0%, #2f87dd 100%)',
};
