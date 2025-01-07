import json
from flask import Blueprint, jsonify, redirect
from spotipy import Spotify
from spotipy.oauth2 import SpotifyOAuth
from spotipy.cache_handler import FlaskSessionCacheHandler
from flask import session
from collections import Counter
from app.config import Config
from app.utils import get_artist_info, get_song_info
import sys


# Initialize cache handler and SpotifyOAuth
cache_handler = FlaskSessionCacheHandler(session)
sp_oauth = SpotifyOAuth(
    client_id=Config.SPOTIFY_CLIENT_ID,
    client_secret=Config.SPOTIFY_CLIENT_SECRET,
    redirect_uri=Config.SPOTIFY_REDIRECT_URI,
    cache_handler=cache_handler
)

# Blueprint for recently played routes
recently_played_bp = Blueprint('recently_played', __name__)
sp = Spotify(auth_manager=sp_oauth)

# Route for getting most listened songs
@recently_played_bp.route('/most_listened/songs', methods=['GET'])
def get_most_listened_songs():
    if not sp_oauth.validate_token(cache_handler.get_cached_token()):
        return redirect(sp_oauth.get_authorize_url())
    
    recently_played = sp.current_user_recently_played(limit=50)
    items = recently_played.get('items', [])
    songs = get_song_info(items)
    
    # Count frequency of each song
    song_counter = Counter([song['name'] for song in songs])
    most_listened_songs = song_counter.most_common()
    print('Hello world!', file=sys.stderr)

    return jsonify({'songs': most_listened_songs})

# Route for getting most listened artists
@recently_played_bp.route('/most_listened/artists', methods=['GET'])
def get_most_listened_artists():
    if not sp_oauth.validate_token(cache_handler.get_cached_token()):
        return redirect(sp_oauth.get_authorize_url())
    
    recently_played = sp.current_user_recently_played(limit=50)
    items = recently_played.get('items', [])
    artists = get_artist_info(items)
    
    # Count frequency of each artist
    artist_counter = Counter(artists)
    most_listened_artists = artist_counter.most_common()
    
    return jsonify({'artists': most_listened_artists})

# Route for getting most popular songs (based on popularity score)
@recently_played_bp.route('/most_popular/songs', methods=['GET'])
def get_most_popular_songs():
    if not sp_oauth.validate_token(cache_handler.get_cached_token()):
        return redirect(sp_oauth.get_authorize_url())
    
    recently_played = sp.current_user_recently_played(limit=50)
    items = recently_played.get('items', [])
    songs = get_song_info(items)
    
    # Sort songs by popularity
    sorted_songs = sorted(songs, key=lambda x: x['popularity'], reverse=True)
    
    return jsonify({'songs': sorted_songs})

# Route for getting most popular artists (based on track popularity)
@recently_played_bp.route('/most_popular/artists', methods=['GET'])
def get_most_popular_artists():
    if not sp_oauth.validate_token(cache_handler.get_cached_token()):
        return redirect(sp_oauth.get_authorize_url())
    
    recently_played = sp.current_user_recently_played(limit=50)
    items = recently_played.get('items', [])
    songs = get_song_info(items)
    
    # Collect artist popularity by averaging track popularity
    artist_popularity = {}
    for song in songs:
        for artist in song['track']['artists']:
            artist_name = artist['name']
            if artist_name not in artist_popularity:
                artist_popularity[artist_name] = {'total_popularity': 0, 'track_count': 0}
            artist_popularity[artist_name]['total_popularity'] += song['popularity']
            artist_popularity[artist_name]['track_count'] += 1
    
    # Average popularity per artist
    avg_artist_popularity = [
        {'artist': artist, 'avg_popularity': data['total_popularity'] / data['track_count']}
        for artist, data in artist_popularity.items()
    ]
    
    # Sort artists by average popularity
    sorted_artists = sorted(avg_artist_popularity, key=lambda x: x['avg_popularity'], reverse=True)
    
    return jsonify({'artists': sorted_artists})

# Route for getting the average popularity score of songs
@recently_played_bp.route('/average/popularity', methods=['GET'])
def get_average_popularity_score():
    if not sp_oauth.validate_token(cache_handler.get_cached_token()):
        return redirect(sp_oauth.get_authorize_url())
    
    recently_played = sp.current_user_recently_played(limit=50)
    items = recently_played.get('items', [])
    songs = get_song_info(items)
    
    # Calculate the average popularity score of the songs
    if songs:
        total_popularity = sum(song['popularity'] for song in songs)
        average_popularity = total_popularity / len(songs)
    else:
        average_popularity = 0
    
    return jsonify({'average_popularity': average_popularity})
