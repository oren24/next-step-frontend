import { StrictMode, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getTheme } from './theme';
import { AuthProvider } from './auth/AuthProvider.jsx';

const THEME_MODE_KEY = 'nextstep.theme.mode';

const getInitialMode = () => {
  try {
    const savedMode = globalThis.localStorage?.getItem(THEME_MODE_KEY);
    if (savedMode === 'light' || savedMode === 'dark') return savedMode;
  } catch {
    // Ignore storage read failures and use system/default fallback.
  }

  if (globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
};

export function Root() {
  const [mode, setMode] = useState(getInitialMode);

  const theme = useMemo(() => getTheme(mode), [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    try {
      globalThis.localStorage?.setItem(THEME_MODE_KEY, mode);
    } catch {
      // Ignore storage write failures.
    }
  }, [mode]);

  return (
    <StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <App isDarkMode={mode === 'dark'} onToggleTheme={toggleTheme} />
        </AuthProvider>
      </ThemeProvider>
    </StrictMode>
  );
}

export default Root;

createRoot(document.getElementById('root')).render(<Root />);
