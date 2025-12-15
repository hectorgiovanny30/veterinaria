import { createTheme } from '@mui/material/styles';

// createTheme genera automáticamente typography, breakpoints, spacing, etc.
const theme = createTheme({
  palette: {
    mode: 'light', // Puedes cambiarlo a 'dark' si prefieres
    primary: {
      main: '#1976d2', // Azul estándar
    },
    secondary: {
      main: '#dc004e', // Rosa estándar
    },
  },
  // No necesitas definir typography manualmente, createTheme lo hace por ti
});

export default theme;