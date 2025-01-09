import { useState } from "react";

const BASE_URL = 'http://localhost:5000';

export const useStats = () => {

  const [artistStats, setArtistStats] = useState({
    mostListened: [],
    mostPopular: []
  });

  const [songStats, setSongStats] = useState({
    mostListened: [],
    mostPopular: []
  });

  const [popularityScore, setPopularityScore] = useState("0");

  const handleFetchError = async (response: Response) => {
    if (response.status == 401){
      const authResponse = await fetch(`${BASE_URL}/auth/url`)
      const authData = await authResponse.json();
      window.location.href = authData.auth_url

      return null
    } 
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error occurred' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json()
  };

  // Fetch most listened songs
  const fetchMostListenedSongs = async () => {
    try {
      const response = await fetch(`${BASE_URL}/recently_played/most_listened/songs`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const data = await handleFetchError(response);

      if (data) {
        setSongStats(prev=>({...prev, mostListened: data.songs}));
      }

    } catch (error) {
      console.error('Error fetching most popular artists:', error);
    }
  };

  // Fetch most popular songs
  const fetchMostPopularSongs = async () => {
    try {
      const response = await fetch(`${BASE_URL}/recently_played/most_popular/songs`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }        
      });
      const data = await handleFetchError(response);
      if (data){
        setSongStats(prev => ({...prev, mostPopular:data.songs}))
      }

    } catch (error) {
      console.error('Error fetching most popular artists:', error);
    }
  };

  // Fetch most listened artists
  const fetchMostListenedArtists = async () => {
    try {
      const response = await fetch(`${BASE_URL}/recently_played/most_listened/artists`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }        
      });

      const data = await handleFetchError(response);
      if (data) {
        setArtistStats(prev => ({...prev, mostListened:data.artists}))
      }
      console.log("data: ", data)
    } catch (error) {
      console.error('Error fetching most listened artists:', error);
    }
  };

  // Fetch most popular artists
  const fetchMostPopularArtists = async () => {
    try {
      const response = await fetch(`${BASE_URL}/recently_played/most_popular/artists`, {
        credentials:'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      const data = await handleFetchError(response);
      if (data)
        setArtistStats((prev) => ({ ...prev, mostPopular: data.artists }));
    } catch (error) {
      console.error('Error fetching most popular artists:', error);
    }
  };

  // Fetch average popularity score
  const fetchAveragePopularityScore = async () => {
    try {
      const response = await fetch(`${BASE_URL}/recently_played/average/popularity`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      const data = await handleFetchError(response);
      if (data) {
        setPopularityScore(data.average_popularity.toString());

      }
    } catch (error) {
      console.error('Error fetching average popularity score:', error);
    }
  };

  return {
    artistStats,
    songStats,
    popularityScore,
    fetchMostListenedSongs,
    fetchMostPopularSongs,
    fetchMostListenedArtists,
    fetchMostPopularArtists,
    fetchAveragePopularityScore
  };
};
