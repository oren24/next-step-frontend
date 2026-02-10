import { AppBar, Toolbar, Typography, IconButton, Box, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { DRAWER_WIDTH, DRAWER_WIDTH_COLLAPSED } from './styles/sidebarStyles';
import {
  getAppBarStyle,
  getToolbarStyle,
  getLeftSectionStyle,
  getTitleStyle,
  getRightSectionStyle,
} from './styles/topBarStyles';
import {
  ThemeToggle,
  SearchBar,
  UserAvatar,
} from './TopBarUtils';

export default function TopBar({ onMenuClick, isDarkMode, onToggleTheme, pageTitle, sidebarCollapsed }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const drawerWidth = sidebarCollapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH;

  return (
    <AppBar position="fixed" elevation={0} sx={getAppBarStyle(drawerWidth)}>
      <Toolbar sx={getToolbarStyle()}>
        {/* Left Section */}
        <Box sx={getLeftSectionStyle()}>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={onMenuClick}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h5" sx={getTitleStyle()}>
            {pageTitle}
          </Typography>
        </Box>

        {/* Right Section */}
        <Box sx={getRightSectionStyle()}>
          <ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleTheme} />
          <SearchBar theme={theme} />
          <UserAvatar />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
