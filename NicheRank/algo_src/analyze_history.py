from typing import Dict, List
from dataclasses import dataclass

import music_dataclass as md
from music_dataclass import calculate_percentile
from sorting import Local_Sort, Global_Sort
from extraction import Stats_Extractor

"""
    THIS IS THE MOST IMPORTANT CLASS!!! Takes your listening history 
    and outputs metrics based on it 

    TODO: create mainstream calcualtor function

"""

@dataclass
class Artist_Metrics:
    favorites: List[md.Artist_Stat]
    most_popular: List[md.Artist_Stat]
    num_listened: int # number of artists listened to 

@dataclass
class Song_Metrics:
    favorites: List[md.Song_Stat]
    most_popular: List[md.Song_Stat]
    num_listened: int

@dataclass
class User_Metrics:
    # data to be returned after analyzing
    artist_metrics: Artist_Metrics
    song_metrics: Song_Metrics
    pop_score: float # val from 0 to 100 of how popular this persons taste is+
    time_listened_s: float

# Behavior Class
class Mainstream_Engine():

    def __init__(self, history: List[md.Song], global_artists_stat_map: Dict[str, md.Artist_Stat], global_song_stat_map: Dict[str, md.Song_Stat]) -> None:
        self.song_history = history
        self.user_artist_stats: List[md.Artist_Stat] = Stats_Extractor.extract_artist_stats_from_songs(history)
        self.user_song_stats: List[md.Song_Stat] = Stats_Extractor.extract_song_stats_from_songs(history)

        self.g_artists_map = global_artists_stat_map
        self.g_song_map = global_song_stat_map
        

    def analyze_history(self) -> User_Metrics:

        artist_metrics = self.calculate_artist_metrics()
        song_metrics = self.calculate_song_metrics()
        time_listened_s = sum(artist_stat.total_s for artist_stat in self.user_artist_stats)
        pop_score = self.calculate_mainstream_score()        
        cur_metric = User_Metrics(artist_metrics=artist_metrics, song_metrics=song_metrics, time_listened_s=time_listened_s, pop_score=pop_score)

        return cur_metric
    
    def calculate_artist_metrics(self) -> Artist_Metrics:
        # Artist Metrics
        favorite_artists: List[md.Artist_Stat] = Local_Sort.merge_sort(self.user_artist_stats)
        popular_artists: List[md.Artist_Stat] = Global_Sort.merge_sort(self.user_artist_stats, self.g_artists_map)
        artist_metrics = Artist_Metrics(favorites=favorite_artists,most_popular=popular_artists,num_listened=len(favorite_artists) )
        return artist_metrics
    
    def calculate_song_metrics(self) -> Song_Metrics:

        # get song metrics
        favorite_songs: List[md.Song_Stat] = Local_Sort.merge_sort(self.user_song_stats)
        popular_songs: List[md.Song_Stat] = Global_Sort.merge_sort(self.user_song_stats, self.g_song_map)  
        song_met = Song_Metrics(favorites=favorite_songs, most_popular=popular_songs, num_listened=len(favorite_songs))
        
        return song_met
 
    def calculate_mainstream_score(self):

        # use calculate_percentile
        return calculate_percentile(self.user_artist_stats, self.g_artists_map)

    def grouping_based_allignment():

        """
            Sections into n groups that represent "popularity tiers" and then
            gives popularity score based off that tier
        """

        pass
