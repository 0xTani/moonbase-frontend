import { createTheme } from '@mui/material';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0a1929',
    },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { backgroundColor: '#001e3c', color: '#f2a900' },
      },
    },
    MuiInputBase: {
      styleOverrides: { root: { color: '#f2a900' } },
    },
    MuiTextField: {
      styleOverrides: {
        root: { color: '#4d4d4e' },
      },
    },
  },
});
