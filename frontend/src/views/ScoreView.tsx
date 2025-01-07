import { CircularProgress } from '@mui/material';

import Button from "../components/ui/Button"
import { useEffect} from 'react'
import ScoreElement from '../components/ui/ScoreElement';

import { Grid, Typography } from '@mui/material';

import { useNavigate } from 'react-router-dom';
import { useStats } from '../hooks/useStats';

export default function ScoreView() {
  const {
    pageState,
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
    fetchAveragePopularityScore()
    
    fetchMostListenedSongs()
    fetchMostListenedArtists()
    
    fetchMostPopularSongs()
    fetchMostPopularArtists()
  }, []);

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
        {pageState.loading ? (
                <CircularProgress color="secondary" />
            ) : (
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
            )}
    </div>
  )
}
