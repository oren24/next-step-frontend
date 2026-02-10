import { Box, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import logoSvg from '../../assets/logo.svg';
import jobApplicationsIcon from '../../assets/side bar icons/WorkOutlineOutlined.svg';
import resumesIcon from '../../assets/side bar icons/FileCopyOutlined.svg';
import subscriptionsIcon from '../../assets/side bar icons/ph_sparkle.svg';
import archiveIcon from '../../assets/side bar icons/material-symbols-light_archive-outline.svg';
import settingsIcon from '../../assets/side bar icons/solar_settings-linear.svg';
import arrowLeftIcon from '../../assets/side bar icons/fe_arrow-left.svg';
import { DIMENSIONS, GRADIENTS, TYPOGRAPHY, getLogoContainerStyle } from './styles/sidebarStyles';

// ==================== NAVIGATION DATA ====================
export const navigationItems = [
  { id: 'job-applications', label: 'Job Applications', path: '/', icon: jobApplicationsIcon },
  { id: 'resumes', label: 'Resumes', path: '/resumes', icon: resumesIcon },
  { id: 'subscriptions', label: 'Subscriptions', path: '/subscriptions', icon: subscriptionsIcon },
  { id: 'archive', label: 'Archive', path: '/archive', icon: archiveIcon },
];

export const bottomNavigationItems = [
  { id: 'settings', label: 'Settings', path: '/settings', icon: settingsIcon },
];

export const SECTION_LABEL = 'Jobs';

// ==================== COMPONENTS ====================

// Logo Component
export function SidebarLogo({ collapsed }) {
  if (collapsed) {
    return (
      <Box sx={getLogoContainerStyle(collapsed)}>
        <Box component="img" src={logoSvg} alt="NextStep Logo" sx={{ width: DIMENSIONS.logo.width, height: DIMENSIONS.logo.height }} />
      </Box>
    );
  }

  return (
    <Box sx={getLogoContainerStyle(collapsed)}>
      <Box sx={{ width: DIMENSIONS.logo.containerWidth, height: DIMENSIONS.logo.containerHeight, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box component="img" src={logoSvg} alt="NextStep Logo" sx={{ width: DIMENSIONS.logo.width, height: DIMENSIONS.logo.height }} />
        <Typography variant="h6" sx={{ 
          ...TYPOGRAPHY.logo, 
          background: GRADIENTS.primary, 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent', 
          backgroundClip: 'text' 
        }}>
          NextStep
        </Typography>
      </Box>
    </Box>
  );
}

// Navigation Item Component
export function NavigationItem({ item, isActive, collapsed, onClick }) {
  return (
    <ListItem disablePadding sx={{ mb: 1, position: 'relative' }}>
      {isActive && (
        <Box sx={{ 
          position: 'absolute', 
          left: 0, 
          width: DIMENSIONS.indicator.width, 
          height: DIMENSIONS.indicator.height, 
          background: GRADIENTS.primary, 
          borderTopRightRadius: '5px', 
          borderBottomRightRadius: '5px' 
        }} />
      )}
      
      <ListItemButton onClick={onClick} sx={{
        width: isActive && !collapsed ? DIMENSIONS.item.activeWidth : collapsed ? 'auto' : DIMENSIONS.item.inactiveWidth,
        height: isActive ? DIMENSIONS.item.activeHeight : DIMENSIONS.item.inactiveHeight,
        borderRadius: '9px',
        py: isActive ? '8px' : 1,
        px: collapsed ? 0 : 2,
        pr: isActive && !collapsed ? '62px' : undefined,
        bgcolor: 'transparent',
        '&:hover': { bgcolor: 'action.hover' },
        transition: 'all 0.2s ease-in-out',
        justifyContent: collapsed ? 'center' : 'flex-start',
        gap: '10px',
      }}>
        <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40, display: 'flex', justifyContent: 'center' }}>
          <Box
            component="img"
            src={item.icon}
            alt={item.label}
            sx={{
              width: DIMENSIONS.item.iconSize,
              height: DIMENSIONS.item.iconSize,
              filter: isActive 
                ? 'invert(45%) sepia(98%) saturate(1795%) hue-rotate(187deg) brightness(95%) contrast(95%)' 
                : 'brightness(0) saturate(100%) invert(50%) sepia(0%)',
              opacity: isActive ? 1 : 0.7,
            }}
          />
        </ListItemIcon>
        
        {!collapsed && (
          <ListItemText
            primary={item.label}
            primaryTypographyProps={{
              ...TYPOGRAPHY.navItem,
              whiteSpace: 'nowrap',
              ...(isActive && {
                background: GRADIENTS.primary,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }),
            }}
          />
        )}
      </ListItemButton>
    </ListItem>
  );
}

// Settings Item Component
export function SettingsItem({ item, isActive, collapsed, onClick, onToggleCollapse }) {
  return (
    <ListItem disablePadding sx={{ mb: collapsed ? 1 : 0, position: 'relative' }}>
      <ListItemButton onClick={onClick} sx={{
        width: isActive && !collapsed ? DIMENSIONS.item.activeWidth : collapsed ? 'auto' : DIMENSIONS.item.inactiveWidth,
        height: isActive ? DIMENSIONS.item.activeHeight : DIMENSIONS.item.inactiveHeight,
        borderRadius: '9px',
        py: isActive ? '8px' : 1,
        px: collapsed ? 0 : 2,
        pr: isActive && !collapsed ? '62px' : undefined,
        bgcolor: 'transparent',
        '&:hover': { bgcolor: 'action.hover' },
        justifyContent: collapsed ? 'center' : 'flex-start',
        gap: '10px',
      }}>
        <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40, display: 'flex', justifyContent: 'center' }}>
          <Box
            component="img"
            src={item.icon}
            alt={item.label}
            sx={{
              width: DIMENSIONS.item.iconSize,
              height: DIMENSIONS.item.iconSize,
              filter: isActive 
                ? 'invert(45%) sepia(98%) saturate(1795%) hue-rotate(187deg) brightness(95%) contrast(95%)' 
                : 'brightness(0) saturate(100%) invert(50%) sepia(0%)',
              opacity: isActive ? 1 : 0.7,
            }}
          />
        </ListItemIcon>
        
        {!collapsed && (
          <>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                ...TYPOGRAPHY.navItem,
                whiteSpace: 'nowrap',
                ...(isActive && {
                  background: GRADIENTS.primary,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }),
              }}
            />
            
            <Box
              component="img"
              src={arrowLeftIcon}
              alt="Collapse"
              onClick={(e) => {
                e.stopPropagation();
                onToggleCollapse();
              }}
              sx={{
                width: 24,
                height: 24,
                opacity: 0.7,
                ml: 'auto',
                cursor: 'pointer',
                '&:hover': { opacity: 1 },
              }}
            />
          </>
        )}
      </ListItemButton>
    </ListItem>
  );
}

// Collapse Toggle Component
export function CollapseToggle({ collapsed, onClick }) {
  if (!collapsed) return null;

  return (
    <ListItem disablePadding>
      <ListItemButton onClick={onClick} sx={{
        height: 30,
        borderRadius: '9px',
        py: 1,
        px: 0,
        justifyContent: 'center',
        '&:hover': { bgcolor: 'action.hover' },
      }}>
        <Box component="img" src={arrowLeftIcon} alt="Expand" sx={{ width: 24, height: 24, opacity: 0.7, transform: 'rotate(180deg)' }} />
      </ListItemButton>
    </ListItem>
  );
}
