'use client';

import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1f6f5b',
    },
    secondary: {
      main: '#8a5a2b',
    },
    background: {
      default: '#f7f8f6',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily:
      'Inter, Roboto, "Helvetica Neue", Arial, system-ui, sans-serif',
  },
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
}

