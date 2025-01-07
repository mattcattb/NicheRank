// src/hooks/useStats.ts

import { useState } from "react";

const BASE_URL = 'http://localhost:5000';

type SongStats = {
  mostListened: any[];
  mostPopular: any[];
};

type ArtistStats = {
  mostListened: any[];
  mostPopular: any[];
};

export const useStats = () => {
  const [pageState, setPageState] = useState({
    error: null, // Holds any error message
    loading: true
  });

  const [artistStats, setArtistStats] = useState<ArtistStats>({
    mostListened: [],
    mostPopular: []
  });

  const [songStats, setSongStats] = useState<SongStats>({
    mostListened: [],
    mostPopular: []
  });

  const [popularityScore, setPopularityScore] = useState("0");

  // Fetch most listened songs
  const fetchMostListenedSongs = async () => {
    try {
      const response = await fetch(`${BASE_URL}/recently_played/most_listened/songs`);
      if (!response.ok) throw new Error('Failed to fetch most listened songs');
      const data = await response.json();
      setSongStats((prev) => ({ ...prev, mostListened: data.songs }));
    } catch (error) {
      setPageState({ error: error.message, loading: false });
    }
  };

  // Fetch most popular songs
  const fetchMostPopularSongs = async () => {
    try {
      const response = await fetch(`${BASE_URL}/recently_played/most_popular/songs`);
      if (!response.ok) throw new Error('Failed to fetch most popular songs');
      const data = await response.json();
      setSongStats((prev) => ({ ...prev, mostPopular: data.songs }));
    } catch (error) {
      setPageState({ error: error.message, loading: false });
    }
  };

  // Fetch most listened artists
  const fetchMostListenedArtists = async () => {
    try {
      const response = await fetch(`${BASE_URL}/recently_played/most_listened/artists`);
      if (!response.ok) throw new Error('Failed to fetch most listened artists');
      const data = await response.json();
      setArtistStats((prev) => ({ ...prev, mostListened: data.artists }));
    } catch (error) {
      setPageState({ error: error.message, loading: false });
    }
  };

  // Fetch most popular artists
  const fetchMostPopularArtists = async () => {
    try {
      const response = await fetch(`${BASE_URL}/recently_played/most_popular/artists`);
      if (!response.ok) throw new Error('Failed to fetch most popular artists');
      const data = await response.json();
      setArtistStats((prev) => ({ ...prev, mostPopular: data.artists }));
    } catch (error) {
      setPageState({ error: error.message, loading: false });
    }
  };

  // Fetch average popularity score
  const fetchAveragePopularityScore = async () => {
    try {
      const response = await fetch(`${BASE_URL}/recently_played/average/popularity`);
      if (!response.ok) throw new Error('Failed to fetch average popularity score');
      const data = await response.json();
      setPopularityScore(data.average_popularity.toString());
    } catch (error) {
      setPageState({ error: error.message, loading: false });
    }
  };

  return {
    pageState,
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
