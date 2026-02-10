// TopBar constants
export const DIMENSIONS = {
  height: 94,
  searchBar: { width: 217, height: 35 },
  searchIcon: { width: 21, height: 21, top: 7, left: 6 },
  avatar: { containerWidth: 153, containerHeight: 44, size: 44, nameWidth: 71, nameHeight: 20, arrowSize: 20 },
};

export const TYPOGRAPHY = {
  title: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: '24px', lineHeight: '100%', letterSpacing: '0%' },
  userName: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', letterSpacing: '0%' },
};

// Style functions
export const getAppBarStyle = (drawerWidth) => ({
  width: { md: `calc(100% - ${drawerWidth}px)` },
  ml: { md: `${drawerWidth}px` },
  bgcolor: 'background.paper',
  borderBottom: '1px solid',
  borderColor: 'divider',
  transition: 'margin-left 0.3s ease-in-out, width 0.3s ease-in-out',
});

export const getToolbarStyle = () => ({
  minHeight: DIMENSIONS.height,
  px: 4,
});

export const getLeftSectionStyle = () => ({
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  flex: 1,
});

export const getTitleStyle = () => ({
  ...TYPOGRAPHY.title,
  color: 'text.primary',
});

export const getRightSectionStyle = () => ({
  display: 'flex',
  alignItems: 'center',
  gap: 2,
});
