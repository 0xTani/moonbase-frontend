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
        root: { backgroundColor: '#001e3c', color: '#ddddff' },
      },
    },
    MuiInputBase: {
      styleOverrides: { root: { color: '#ccc' } },
    },
    MuiTextField: {
      styleOverrides: {
        root: { color: '#4d4d4e' },
      },
    },
  },
});
