import PropTypes from 'prop-types';
import { Box, IconButton, InputBase, Avatar, Typography, useTheme } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SearchIcon from '@mui/icons-material/Search';
import arrowLeftIcon from '../../assets/side bar icons/fe_arrow-left.svg';
import { DIMENSIONS, TYPOGRAPHY } from './styles/topBarStyles';

// ==================== COMPONENTS ====================

// Theme Toggle Component
const ThemeToggle = ({ isDarkMode, onToggle }) => {
  return (
    <IconButton
      onClick={onToggle}
      sx={{
        color: 'text.primary',
        borderRadius: 2,
        '&:hover': { bgcolor: 'action.hover' },
        '&:focus': { outline: 'none' }
      }}
    >
      {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
    </IconButton>
  );
};

// Search Bar Component
const SearchBar = ({ placeholder = 'Search..', value = '', onChange }) => {
  const muiTheme = useTheme();

  return (
    <Box sx={{
      position: 'relative',
      width: DIMENSIONS.searchBar.width,
      height: DIMENSIONS.searchBar.height,
      borderRadius: 2,
      bgcolor: 'background.paper',
      border: '1px solid',
      borderColor: 'divider',
      '&:hover': { borderColor: 'primary.main' },
      '&:focus-within': { borderColor: 'primary.main', boxShadow: `0 0 0 2px ${muiTheme.palette.primary.main}20` },
      transition: 'all 0.2s ease-in-out',
    }}>
      <Box sx={{
        position: 'absolute',
        top: `${DIMENSIONS.searchIcon.top}px`,
        left: `${DIMENSIONS.searchIcon.left}px`,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <SearchIcon sx={{ color: 'text.secondary', width: DIMENSIONS.searchIcon.width, height: DIMENSIONS.searchIcon.height }} />
      </Box>
      <InputBase 
        placeholder={placeholder} 
        value={value}
        onChange={(event) => {
          if (onChange) onChange(event.target.value);
        }}
        sx={{
          color: 'inherit',
          width: '100%',
          height: '100%',
          '& .MuiInputBase-input': {
            padding: muiTheme.spacing(0.75, 1, 0.75, 0),
            paddingLeft: `calc(1em + ${muiTheme.spacing(3.5)})`,
            height: '100%',
            fontSize: '0.85rem',
            '&::placeholder': {
              color: 'text.secondary',
              opacity: 1,
            },
          },
        }} 
      />
    </Box>
  );
};

// User Avatar Component
const UserAvatar = ({ userName = 'My Name', avatarLetter = 'U', onClick, isExpanded = false }) => {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      aria-haspopup="menu"
      aria-expanded={isExpanded}
      sx={{
      width: DIMENSIONS.avatar.containerWidth,
      height: DIMENSIONS.avatar.containerHeight,
      display: 'flex',
      alignItems: 'center',
      gap: '9px',
      cursor: 'pointer',
      border: 'none',
      background: 'transparent',
      padding: 0,
      '&:hover': { opacity: 0.8 },
      '&:focus': { outline: 'none' },
    }}
    >
      <Avatar sx={{
        width: DIMENSIONS.avatar.size,
        height: DIMENSIONS.avatar.size,
        bgcolor: 'primary.main',
        borderRadius: '5px',
        fontSize: '1rem',
        fontWeight: 600,
      }}>
        {avatarLetter}
      </Avatar>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <Typography sx={{
          ...TYPOGRAPHY.userName,
          width: DIMENSIONS.avatar.nameWidth,
          height: DIMENSIONS.avatar.nameHeight,
          color: 'text.primary',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {userName}
        </Typography>
        <Box component="img" src={arrowLeftIcon} alt="Menu" sx={{ width: DIMENSIONS.avatar.arrowSize, height: DIMENSIONS.avatar.arrowSize, transform: 'rotate(270deg)', opacity: 0.7 }} />
      </Box>
    </Box>
  );
};

ThemeToggle.propTypes = {
  isDarkMode: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

UserAvatar.propTypes = {
  userName: PropTypes.string,
  avatarLetter: PropTypes.string,
  onClick: PropTypes.func,
  isExpanded: PropTypes.bool,
};

export {
  ThemeToggle,
  SearchBar,
  UserAvatar,
};

