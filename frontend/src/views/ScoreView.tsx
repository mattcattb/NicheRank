import { useEffect, useState } from 'react'
import { CircularProgress, Typography, Button } from '@mui/material';

import {FoldableGrid} from "../components/FoldableGrid";
import MyButton from "../components/ui/MyButton";

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
  <div className='p-2 flex flex-col items-center'> 
    <Typography variant='h1' className="text-primary font-bold text-4xl">Your Spotify Results</Typography>
    <div className='buttons-top flex flex-row items-center'>
      <Button onClick={()=>{navigate('/')}}>Back</Button>
      <Typography variant='h3'>Popularity Score: <b>{popularityScore}</b></Typography>
    </div>
    <div className='flex flex-row mt-3 gap-0.5	'>
      <div className='popular'>
        <Typography variant='h2'>Most Popular</Typography>
        <FoldableGrid gridItems={artistStats.mostPopular.map(stat => ({name: stat.name, score: stat.score}))} ></FoldableGrid>
      </div>

      <div className='listened'>
        <Typography variant='h2'>Most Listened</Typography>
        <FoldableGrid gridItems={artistStats.mostListened.map(item => ({name: item.name, score: item.listens}))} ></FoldableGrid>

      </div>
    </div>
  </div>)
}
