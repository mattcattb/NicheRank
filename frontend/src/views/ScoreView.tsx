import { CircularProgress } from '@mui/material';

import Button from "../components/ui/Button"
import { useEffect, useState } from 'react'
import ScoreElement from '../components/ui/ScoreElement';

import { Grid, Typography } from '@mui/material';

import { useNavigate } from 'react-router-dom';
import { useStats } from '../hooks/useStats';

export default function ScoreView() {

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState(null);

  const {
    artistStats,
    songStats,
    popularityScore,
    fetchMostListenedSongs,
    fetchMostPopularSongs,
    fetchMostListenedArtists,
    fetchMostPopularArtists,
    fetchAveragePopularityScore
  } = useStats();  

  const navigate = useNavigate();

  // Fetch most listened songs
  useEffect(() => {
    const fetch_data = async () => {
      try {
        setIsLoading(true)
        await Promise.all([
          fetchAveragePopularityScore(),
          fetchMostListenedSongs(),
          fetchMostListenedArtists(),
          fetchMostPopularSongs(),
          fetchMostPopularArtists()          
        ])
      } catch (error) {
        setError("An error occured while fetching spotify stats data.");
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetch_data();
  }, []);



    if (isLoading) {
      return (
        <div>
          <CircularProgress color="secondary" />
        </div>
      );
    }

    if (error) {
      return (
        <div>
          <Typography color="error">{error}</Typography>
        </div>
      );
    }

    return (
    <div style={{
        height: "100vh",
        background: "#AD96DC",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Roboto', sans-serif",
    }}> 
        <Button onClick={()=>{navigate('/')}} text={"back"}/>
          <Grid container spacing={6} sx={{ mt: 2 }}>
              <Grid item xs={12} sx={{ textAlign: 'center', mb: 2 }}>
                  <Typography component="h1" color="primary" gutterBottom align="center">
                      Your Most Listened Artists:
                  </Typography>
                  <Typography variant="h1" color="primary">
                      Your Most Listened Songs:
                  </Typography>

                  <Typography component="h3" color="secondary" variant="h3">
                      Popularity Score: {popularityScore}%
                  </Typography>
              </Grid>
              <Grid container item xs={12} spacing={3}>
                  <Grid item xs={6} style={{ padding: '20px' }}>
                      <Grid container direction="column" spacing={2}>
                          {artistStats.mostListened.map((artist, index) => (
                              <ScoreElement content={artist} index={index} key={index} />
                          ))}
                      </Grid>
                  </Grid>
                  {/* Grid item for the top songs list */}
                  <Grid item xs={6} style={{ padding: '20px' }}>
                      <Grid container direction="column" spacing={2}>
                          {songStats.mostListened.map((song, index) => (
                              <ScoreElement content={song} index={index} key={index} />
                          ))}
                      </Grid>
                  </Grid>
              </Grid>
          </Grid>
    </div>
  )
}
