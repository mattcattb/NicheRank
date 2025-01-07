import {
  BrowserRouter as Router, // BrowserRouter for handling routing
  useLocation, // Hook to access the current location
} from "react-router-dom";
import { Grid, Typography, Button } from "@mui/material"; // Importing Material-UI components

export default function HomeView() {

  const handleLogin = () => {
    window.location.href = "http://127.0.0.1:5000/"; // Redirect to Flask backend for authentication
  };

  return (
    // Main container that sets the layout, centering, background color, and padding based on the current page
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography
          component="h4"
          variant="h4"
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            position: "relative",
            top: -100,
            color: "#fff",
          }}
        >
          Welcome to your Niche Ranking Music!
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Typography
          component="h6"
          variant="h6"
          style={{
            fontSize: "2rem",
            color: "#fff",
            position: "relative",
            top: -90,
          }}
        >
          Learn more about your music taste and compare it to others
          with Obscurify.
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <Button
          color="secondary"
          variant="contained"
          style={{
            minWidth: "200px",
            height: "200px",
            borderRadius: "50%",
            padding: "10px",
            fontSize: "2rem",
          }}
          onClick={handleLogin} // on click go to spotify auth
        >
          Login
        </Button>
      </Grid>
    </Grid>
  );
}
