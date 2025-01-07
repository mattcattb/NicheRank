import { Grid, Typography, Button } from "@mui/material"; // Importing Material-UI components

const BASE_URL = 'http://localhost:5000';

export default function HomeView() {

  const redirectToSpotify = async () => {
    try {
      const response = await fetch(`${BASE_URL}/auth/url`);
      const data = await response.json();
      window.location.href = data.auth_url; // Redirect to Spotify authorization page
    } catch (error) {
      console.error("Error during authorization", error);
    }
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
          onClick={redirectToSpotify} // on click go to spotify auth
        >
          Login
        </Button>
      </Grid>
    </Grid>
  );
}
