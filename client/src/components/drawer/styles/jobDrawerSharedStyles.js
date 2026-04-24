export const sectionSx = (theme) => ({
  p: 2.5,
  borderBottom: `1px solid ${theme.palette.divider}`,
});

export const scrollSectionSx = (theme) => ({
  ...sectionSx(theme),
  overflowY: 'auto',
  flex: 1,
});

export const minWidthZeroSx = {
  minWidth: 0,
};

