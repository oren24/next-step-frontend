import { StrictMode, useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getTheme } from './theme';

function Root() {
  const [mode, setMode] = useState('dark');

  const theme = useMemo(() => getTheme(mode), [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App isDarkMode={mode === 'dark'} onToggleTheme={toggleTheme} />
      </ThemeProvider>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')).render(<Root />);
