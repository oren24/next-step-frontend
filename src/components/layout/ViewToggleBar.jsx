import React from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';

const ViewToggleBar = ({ currentView, onViewChange }) => {
  const theme = useTheme();
  
  const buttonBaseStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: '5px',
    padding: '2px 5px 2px 3px',
    width: 90,
    height: 34,
    opacity: 1,
    border: 'none',
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : '#F5F5F5',
    cursor: 'pointer',
    borderRadius: '4px',
    '&:focus': {
      outline: 'none',
    },
  };

  const activeButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : '#FFFFFF',
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 2px 8px rgba(255,255,255,0.1)' 
      : '0 2px 8px rgba(0,0,0,0.1)',
  };

  const iconBaseStyle = {
    width: 20,
    height: 20,
    opacity: 1,
    display: 'block',
    flexShrink: 0,
  };

  const textBaseStyle = {
    fontFamily: 'Space Grotesk',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '100%',
    letterSpacing: '0%',
    color: 'text.primary',
  };

  const activeTextStyle = {
    fontFamily: 'Space Grotesk',
    fontWeight: 700,
    fontSize: '14px',
    lineHeight: '100%',
    letterSpacing: '0%',
    background: 'linear-gradient(180deg, #339AF0 0%, #1864AB 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  const exportButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '5px 10px',
    width: 104,
    height: 40,
    opacity: 1,
    borderRadius: '10px',
    border: '1px solid',
    borderColor: 'divider',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    '&:focus': {
      outline: 'none',
    },
  };

  const exportTextStyle = {
    fontFamily: 'Inter',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '100%',
    letterSpacing: '0%',
    color: 'text.primary',
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: 0,
      }}
    >
      {/* Left side - View toggle buttons */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0, ml: '16px' }}>
        {/* List button */}
        <Button
          onClick={() => onViewChange('list')}
          sx={currentView === 'list' ? activeButtonStyle : buttonBaseStyle}
        >
          <Box
            component="img"
            src="/src/assets/main section icons/material-symbols-light_list.svg"
            alt="List"
            sx={{
              ...iconBaseStyle,
              width: 20,
              height: 20,
              filter: currentView === 'list' 
                ? 'invert(45%) sepia(98%) saturate(1795%) hue-rotate(187deg) brightness(95%) contrast(95%)'
                : 'brightness(0) saturate(100%) invert(50%) sepia(0%)',
              opacity: currentView === 'list' ? 1 : 0.7,
            }}
          />
          <Typography
            sx={currentView === 'list' ? activeTextStyle : textBaseStyle}
          >
            List
          </Typography>
        </Button>

        {/* Kanban button */}
        <Button
          onClick={() => onViewChange('kanban')}
          sx={currentView === 'kanban' ? activeButtonStyle : buttonBaseStyle}
        >
          <Box
            component="img"
            src="/src/assets/main section icons/tabler_blocks.svg"
            alt="Kanban"
            sx={{
              ...iconBaseStyle,
              width: 20,
              height: 20,
              filter: currentView === 'kanban' 
                ? 'invert(45%) sepia(98%) saturate(1795%) hue-rotate(187deg) brightness(95%) contrast(95%)'
                : 'brightness(0) saturate(100%) invert(50%) sepia(0%)',
              opacity: currentView === 'kanban' ? 1 : 0.7,
            }}
          />
          <Typography
            sx={currentView === 'kanban' ? activeTextStyle : textBaseStyle}
          >
            Kanban
          </Typography>
        </Button>
      </Box>

      {/* Right side - Export button */}
      <Button sx={exportButtonStyle}>
        <Box
          component="img"
          src="/src/assets/main section icons/excel.svg"
          alt="Export"
          sx={{
            width: 24,
            height: 24,
            opacity: 1,
          }}
        />
        <Typography sx={exportTextStyle}>
          Export
        </Typography>
      </Button>
    </Box>
  );
};

export default ViewToggleBar;