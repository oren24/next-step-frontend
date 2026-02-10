// Sidebar constants
export const DRAWER_WIDTH = 280;
export const DRAWER_WIDTH_COLLAPSED = 80;

export const DIMENSIONS = {
  logo: { 
    width: 40, 
    height: 40, 
    containerWidth: 188, 
    containerHeight: 60 
  },
  item: { 
    activeWidth: 272, 
    inactiveWidth: 126, 
    activeHeight: 46, 
    inactiveHeight: 30, 
    iconSize: 24 
  },
  indicator: { 
    width: 3, 
    height: 22 
  },
};

export const GRADIENTS = {
  primary: 'linear-gradient(180deg, #1B85E9 0%, #88C7FC 100%)',
};

export const TYPOGRAPHY = {
  logo: { 
    fontFamily: '"Space Grotesk", sans-serif', 
    fontSize: '25.38px', 
    fontWeight: 700, 
    lineHeight: '100%' 
  },
  sectionLabel: { 
    fontFamily: '"Space Grotesk", sans-serif', 
    fontSize: '16px', 
    fontWeight: 400, 
    lineHeight: '100%', 
    color: '#A2A2A2' 
  },
  navItem: { 
    fontFamily: '"Inter", sans-serif', 
    fontSize: '20px', 
    fontWeight: 400, 
    lineHeight: '100%' 
  },
};

// Style functions
export const getContainerStyle = () => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  bgcolor: 'background.paper',
});

export const getLogoContainerStyle = (collapsed) => ({
  minHeight: 64,
  display: 'flex',
  alignItems: 'center',
  justifyContent: collapsed ? 'center' : 'flex-start',
  px: 3,
});

export const getSectionLabelStyle = (collapsed) => ({
  ...TYPOGRAPHY.sectionLabel,
  py: 1,
  pl: collapsed ? 0 : '12px',
  display: 'block',
  textAlign: collapsed ? 'center' : 'left',
});

export const getDrawerStyle = (collapsed) => ({
  width: collapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH,
  flexShrink: 0,
  transition: 'width 0.3s ease-in-out',
  '& .MuiDrawer-paper': {
    width: collapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH,
    boxSizing: 'border-box',
    border: 'none',
    borderRight: '1px solid',
    borderColor: 'divider',
    transition: 'width 0.3s ease-in-out',
  },
});

export const getTemporaryDrawerStyle = (collapsed) => ({
  '& .MuiDrawer-paper': {
    width: collapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH,
    boxSizing: 'border-box',
    border: 'none',
    transition: 'width 0.3s ease-in-out',
  },
});
