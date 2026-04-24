export const iconMetaSx = (theme) => ({
  fontSize: 20,
  color: theme.palette.text.secondary,
  mt: 0.2,
});

export const iconContentBoxSx = {
  display: 'flex',
  gap: 1.5,
};

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

