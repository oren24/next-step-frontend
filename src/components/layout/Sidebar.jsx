import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Drawer, List, Typography, Divider } from '@mui/material';
import { 
  DRAWER_WIDTH, 
  DRAWER_WIDTH_COLLAPSED, 
  getContainerStyle, 
  getSectionLabelStyle, 
  getDrawerStyle, 
  getTemporaryDrawerStyle 
} from './styles/sidebarStyles';
import {
  SECTION_LABEL,
  navigationItems,
  bottomNavigationItems,
  SidebarLogo,
  NavigationItem,
  SettingsItem,
  CollapseToggle,
} from './SidebarUtils';

export default function Sidebar({ open, onClose, variant = 'permanent', onCollapse }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleNavigate = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  const handleToggleCollapse = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    if (onCollapse) onCollapse(newCollapsed);
  };

  const drawerContent = (
    <Box sx={getContainerStyle()}>
      {/* Logo Section */}
      <SidebarLogo collapsed={collapsed} />
      
      <Divider sx={{ mx: 2 }} />

      {/* Main Navigation */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 2, py: 2 }}>
        <Typography variant="caption" sx={getSectionLabelStyle(collapsed)}>
          {SECTION_LABEL}
        </Typography>
        
        <List disablePadding>
          {navigationItems.map((item) => (
            <NavigationItem
              key={item.id}
              item={item}
              isActive={location.pathname === item.path}
              collapsed={collapsed}
              onClick={() => handleNavigate(item.path)}
            />
          ))}
        </List>
      </Box>

      {/* Bottom Navigation */}
      <Box sx={{ px: 2, pb: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <List disablePadding>
          {bottomNavigationItems.map((item) => (
            <SettingsItem
              key={item.id}
              item={item}
              isActive={location.pathname === item.path}
              collapsed={collapsed}
              onClick={() => handleNavigate(item.path)}
              onToggleCollapse={handleToggleCollapse}
            />
          ))}
          <CollapseToggle collapsed={collapsed} onClick={handleToggleCollapse} />
        </List>
      </Box>
    </Box>
  );

  if (variant === 'temporary') {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={getTemporaryDrawerStyle(collapsed)}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer variant="permanent" sx={getDrawerStyle(collapsed)}>
      {drawerContent}
    </Drawer>
  );
}

export { DRAWER_WIDTH, DRAWER_WIDTH_COLLAPSED };
