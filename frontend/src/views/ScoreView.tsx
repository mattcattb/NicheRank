import { useEffect, useState } from 'react';
import { CircularProgress, Typography, Button } from '@mui/material';

import { FoldableGrid } from '../components/FoldableGrid';
import MyButton from '../components/ui/MyButton';

import { useNavigate } from 'react-router-dom';
import { useStats } from '../hooks/useStats';

// TODO - add loaders to when loading stats, add skeleton stats

export default function ScoreView() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statType, setStatType] = useState<'popular' | 'listened'>('popular');

  const {
    artistStats,
    songStats,
    popularityScore,
    fetchMostListenedSongs,
    fetchMostPopularSongs,
    fetchMostListenedArtists,
    fetchMostPopularArtists,
    fetchAveragePopularityScore,
  } = useStats();

  const navigate = useNavigate();

  const toggleStatType = () => {
    setStatType((prev) => (prev === 'popular' ? 'listened' : 'popular'));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          fetchAveragePopularityScore(),
          fetchMostListenedSongs(),
          fetchMostListenedArtists(),
          fetchMostPopularSongs(),
          fetchMostPopularArtists(),
        ]);
      } catch (error) {
        setError('An error occurred while fetching Spotify stats data.');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
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

  const createMediaGridItems = (stats, type) => {
    if (type === 'popular') {
      return stats.mostPopular.map((stat) => ({
        name: stat.name,
        score: stat.score,
      }));
    } else {
      return stats.mostListened.map((stat) => ({
        name: stat.name,
        score: stat.listens,
      }));
    }
  };

  // TODO - spacing graphs better 
  // TODO - remove MUI for daisychain

  return (
    <div className='h-screen'>

      <div className="m-4 p-2 flex flex-col items-center gap-4 pt-20">
        <Typography variant="h1" className="text-primary font-bold text-4xl">
          Your Spotify Results
        </Typography>
        <div className="buttons-top flex flex-row items-center gap-4">
          <Button onClick={() => navigate('/')}>Back</Button>
          <Typography variant="h3">
            Popularity Score: <b>{popularityScore}</b>
          </Typography>
          <MyButton onClick={toggleStatType}>
            {statType === 'popular' ? 'Show Most Listened' : 'Show Most Popular'}
          </MyButton>
        </div>
        <div className="flex flex-row justify-evenly mt-3 gap-10">
          <div className="flex flex-col">
            <h1 className='text-3xl font-bold'>
              Artists ({statType === 'popular' ? 'Most Popular' : 'Most Listened'})
            </h1>
            <FoldableGrid grid={createMediaGridItems(artistStats, statType)} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold">
              Songs ({statType === 'popular' ? 'Most Popular' : 'Most Listened'})
            </h1>
            <FoldableGrid grid={createMediaGridItems(songStats, statType)} />
          </div>
        </div>
      </div>
    </div>
  );
}
