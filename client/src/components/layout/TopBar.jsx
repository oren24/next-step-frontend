import PropTypes from 'prop-types';
import { AppBar, Toolbar, Typography, IconButton, Box, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Account } from '@toolpad/core/Account';
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
} from './TopBarUtils';

function TopBar(props) {
  const {
    onMenuClick,
    isDarkMode,
    onToggleTheme,
    pageTitle,
    sidebarCollapsed,
    searchQuery,
    onSearchChange,
  } = props;

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
          <SearchBar value={searchQuery} onChange={onSearchChange} />
          <Account slotProps={{ signOutButton: { color: 'inherit' } }} />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

TopBar.propTypes = {
  onMenuClick: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
  onToggleTheme: PropTypes.func.isRequired,
  pageTitle: PropTypes.string.isRequired,
  sidebarCollapsed: PropTypes.bool.isRequired,
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};

export default TopBar;

