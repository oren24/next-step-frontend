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

export const iconButtonsContainerSx = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.5,
};

