import { createTheme,  } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Default primary color
      light: '#63a4ff',
      dark: '#004ba0',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    h2:{
      fontSize:'1.4rem',
      fontWeight:600
    },
    h3: {
      fontSize:'1rem',
      fontWeight:400
    },
  },
})