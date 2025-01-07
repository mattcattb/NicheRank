import { CircularProgress } from '@mui/material';

import Button from "../components/ui/Button"
import { useState, useEffect} from 'react'
import ScoreElement from '../components/ui/ScoreElement';

import { Grid, Typography } from '@mui/material';

import { useNavigate } from 'react-router-dom';

export default function ScoreView() {
  
    const navigate = useNavigate();

    const [scoreResults, setScoreResults] = useState({
        artists: [],
        songs: [], // Holds the list of top songs
        popularityScore: "0", // Holds the obscurity score
    })

    const [pageState, setPageState] = useState({
        error: null, // Holds any error message
        loading: true
    })

    useEffect(() => {
        setPageState({
            ...pageState,
            loading:true
        })
        fetch("http://127.0.0.1:5000/user_metrics")
            .then((response) => response.json())
            .then((data)=>{
                setScoreResults({
                    artists:data.topArtists,
                    songs:data.topSongs,
                    popularityScore:(data.pop_score*100).toFixed(1)
                });
            })
            .catch((error)=>{
                console.error("Error fetching data:", error);
                setPageState({
                    ...pageState,
                    error: error.message
                  })
            })
            .finally(()=>{
                setPageState({...pageState, loading:false})
            })
        }
    , []);

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
                            Your top Artists:
                        </Typography>
                        <Typography variant="h1" color="primary">
                            Your Top Song Playlist
                        </Typography>

                        <Typography component="h3" color="secondary" variant="h3">
                            Popularity Score: {scoreResults.popularityScore}%
                        </Typography>
                    </Grid>
                    <Grid container item xs={12} spacing={3}>
                        {/* Grid item for the top artists list */}
                        <Grid item xs={6} style={{ padding: '20px' }}>
                            <Grid container direction="column" spacing={2}>
                                {scoreResults.artists.map((artist, index) => (
                                    <ScoreElement content={artist} index={index} key={index} />
                                ))}
                            </Grid>
                        </Grid>
                        {/* Grid item for the top songs list */}
                        <Grid item xs={6} style={{ padding: '20px' }}>
                            <Grid container direction="column" spacing={2}>
                                {scoreResults.songs.map((song, index) => (
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
