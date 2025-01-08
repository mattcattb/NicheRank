import { createTheme,  } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1DB954',  // Spotify Green
      light: '#191414', // Dark background
      accent: '#ffffff', // White for elements like text or buttons
      dark: '#004ba0', // Dark blue for accents
    },
    secondary: {
      main: '#f50057',  // Secondary pink
    },
    background: {
      default: '#191414',  // Dark background for the entire page
      paper: '#1e1e1e',  // Lighter background for components like cards
    },
    text: {
      primary: '#ffffff', // White text
      secondary: '#f1f1f1', // Light text for secondary elements
    },
  },
  typography: {
    fontFamily: "Montserrat",
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
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#1DB954',  // Green background for buttons
          color: '#ffffff',  // White text
          '&:hover': {
            backgroundColor: '#004ba0',  // Darker green on hover
          },
        },
      },
    },
  }

})