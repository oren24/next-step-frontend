import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Match the project's CSS design language (see src/index.css and src/App.css)
const spaceGroteskFont = '"Space Grotesk", sans-serif';
const interFont = '"Inter", sans-serif';

// Create theme instances for light and dark modes
export const getTheme = (mode) => createTheme({
    palette: {
        mode,
        primary: {
            main: '#1B85E9',
            light: '#88C7FC',
            dark: '#1565c0',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#19857b',
        },
        error: {
            main: red.A400,
        },
        gradient: {
            primary: 'linear-gradient(180deg, #1B85E9 0%, #88C7FC 100%)',
        },
        background: mode === 'dark' ? {
            default: '#242424',
            paper: '#1a1a1a',
        } : {
            default: '#f5f5f5',
            paper: '#ffffff',
        },
        text: mode === 'dark' ? {
            primary: 'rgba(255, 255, 255, 0.87)',
            secondary: 'rgba(255, 255, 255, 0.6)',
        } : {
            primary: 'rgba(0, 0, 0, 0.87)',
            secondary: 'rgba(0, 0, 0, 0.6)',
        },
    },
    typography: {
        fontFamily: interFont,
        logo: {
            fontFamily: spaceGroteskFont,
            fontWeight: 700,
            fontSize: '25.38px',
            lineHeight: '100%',
            letterSpacing: '0%',
        },
        sidebarItem: {
            fontFamily: interFont,
            fontWeight: 400,
            fontSize: '20px',
            lineHeight: '100%',
            letterSpacing: '0%',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                },
                containedPrimary: {
                    backgroundColor: '#646cff',
                    color: '#ffffff',
                    '&:hover': {
                        backgroundColor: '#535bf2',
                    },
                },
            },
        },
        MuiLink: {
            defaultProps: {
                underline: 'none',
            },
            styleOverrides: {
                root: {
                    color: '#646cff',
                    '&:hover': {
                        color: '#535bf2',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
    },
});

// Default theme (dark mode)
export const theme = getTheme('dark');
