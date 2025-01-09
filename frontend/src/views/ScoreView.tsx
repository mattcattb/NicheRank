import { useEffect, useState } from 'react';
import { CircularProgress, Typography, Button } from '@mui/material';

import { FoldableGrid } from '../components/FoldableGrid';
import MyButton from '../components/ui/MyButton';

import { useNavigate } from 'react-router-dom';
import { useStats } from '../hooks/useStats';

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

  return (
    <div className="m-4 p-2 flex flex-col items-center gap-4">
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
      <div className="flex flex-row mt-3 gap-4">
        <div className="artists">
          <Typography variant="h2">
            Artists ({statType === 'popular' ? 'Most Popular' : 'Most Listened'})
          </Typography>
          <FoldableGrid grid={createMediaGridItems(artistStats, statType)} />
        </div>
        <div className="songs">
          <Typography variant="h2">
            Songs ({statType === 'popular' ? 'Most Popular' : 'Most Listened'})
          </Typography>
          <FoldableGrid grid={createMediaGridItems(songStats, statType)} />
        </div>
      </div>
    </div>
  );
}
