import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { DRAWER_WIDTH, DRAWER_WIDTH_COLLAPSED } from './styles/sidebarStyles';

const pageTitles = {
  '/': 'Job Applications',
  '/resumes': 'Resumes',
  '/subscriptions': 'Subscriptions',
  '/archive': 'Archive',
  '/settings': 'Settings',
};

export default function Layout({ isDarkMode, onToggleTheme }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const currentPageTitle = pageTitles[location.pathname] || 'NextStep';
  const drawerWidth = sidebarCollapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarCollapse = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      {isMobile ? (
        <Sidebar
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          onCollapse={handleSidebarCollapse}
        />
      ) : (
        <Sidebar variant="permanent" onCollapse={handleSidebarCollapse} />
      )}

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: 'background.paper',
          transition: 'width 0.3s ease-in-out',
        }}
      >
        {/* Top Bar */}
        <TopBar
          onMenuClick={handleDrawerToggle}
          isDarkMode={isDarkMode}
          onToggleTheme={onToggleTheme}
          pageTitle={currentPageTitle}
          sidebarCollapsed={sidebarCollapsed}
        />

        {/* Page Content */}
        <Box sx={{ mt: '94px' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
