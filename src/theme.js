import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Match the project's CSS design language (see src/index.css and src/App.css)
const systemFont = 'system-ui, Avenir, Helvetica, Arial, sans-serif';

// Create a theme instance.
export const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#646cff',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#19857b',
        },
        error: {
            main: red.A400,
        },
        background: {
            default: '#242424',
            paper: '#1a1a1a',
        },
        text: {
            primary: 'rgba(255, 255, 255, 0.87)',
        },
    },
    typography: {
        fontFamily: systemFont,
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
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: '#242424',
                },
            },
        },
    },
});
