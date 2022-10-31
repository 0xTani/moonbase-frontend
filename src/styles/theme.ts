import { createTheme } from '@mui/material';

export const darkTheme = createTheme({
  typography: {
    h1: {
      fontSize: '3rem',
      fontWeight: '500',
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    h2: {
      fontWeight: '500',
      fontSize: '2.5rem',
      '@media (max-width:600px)': {
        fontSize: '1rem',
      },
    },
    h3: {
      fontWeight: '500',
      fontSize: '2rem',
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    h4: {
      fontSize: '1.5rem',
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    h5: {
      fontWeight: '500',
      fontSize: '1rem',
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    h6: {
      fontWeight: '400',
      fontSize: '1rem',
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
  },

  palette: {
    mode: 'dark',
    background: {
      default: '#000',
    },
    secondary: {
      light: '#ccc',
      main: '#aaa',
      dark: '#ccc',
      contrastText: '#fff',
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
        root: { backgroundColor: '#080808cc', color: '#dddddd' },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: { color: '#ccc' },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: { color: '#4d4d4e' },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: { paddingBottom: '1rem !important', padding: '1rem' },
      },
    },
  },
});
