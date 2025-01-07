
const BASE_URL = 'http://localhost:5000';

const redirectToSpotify = async () => {
  try {
    const response = await fetch(`${BASE_URL}/recently_played/authorize`);
    const data = await response.json();
    window.location.href = data.auth_url; // Redirect to Spotify authorization page
  } catch (error) {
    console.error("Error during authorization", error);
  }
};