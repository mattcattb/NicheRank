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
  
  return(
    <div className="flex flex-col m-3">
      <Typography variant="h1">Welcome to your Niche Ranking Music!</Typography>
      <div className="flex flex-col m-10 items-center gap-y-5">
        <Typography>
          See how popular your taste is and 
          who your favorite songs and artists are! 
        </Typography>
        <Button
          color="secondary"
          className="w-20 h-20 rounded-full flex items-center justify-center text-white text-lg"
          onClick={redirectToSpotify} // on click go to spotify auth
        >
          Login
        </Button>
      </div>

    </div>

  );
}
