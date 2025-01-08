from flask import Blueprint, jsonify, redirect, g
from spotipy import Spotify
from spotipy.oauth2 import SpotifyOAuth
from spotipy.cache_handler import FlaskSessionCacheHandler
from flask import session
from app.config import Config
from app.utils import get_artist_info, get_song_info
import traceback


# Initialize cache handler and SpotifyOAuth
cache_handler = FlaskSessionCacheHandler(session)
sp_oauth = SpotifyOAuth(
    client_id=Config.SPOTIFY_CLIENT_ID,
    client_secret=Config.SPOTIFY_CLIENT_SECRET,
    redirect_uri=Config.SPOTIFY_REDIRECT_URI,
    scope= Config.SPOTIFY_SCOPE,
    cache_handler=cache_handler
)

# Blueprint for recently played routes
recently_played_bp = Blueprint('recently_played', __name__)

# Utility function for token validation and Spotify client initialization
def get_spotify_client():
    try:
        cached_token = cache_handler.get_cached_token()
        if not cached_token or not sp_oauth.validate_token(cached_token):
            if not cached_token or 'refresh_token' not in cached_token:
                return None, True
            new_token = sp_oauth.refresh_access_token(cached_token['refresh_token'])
            cache_handler.save_token_to_cache(new_token)
            cached_token = new_token
        return Spotify(auth=cached_token['access_token']), False
    except Exception as e:
        print(f"Error in get_spotify_client: {str(e)}")
        print(traceback.format_exc())
        return None, True

# Middleware-like decorator for token handling
def require_spotify(f):
    def wrapped(*args, **kwargs):
        try:
            sp_client, auth_required = get_spotify_client()
            if auth_required:
                return jsonify({"error:":"Authentication required"}), 401
            g.sp = sp_client  # Attach Spotify client to Flask's `g` context
            return f(*args, **kwargs)
        except Exception as e:
            print(f"Error in require spotify: {str(e)}")
            print(traceback.format_exc())
            return jsonify({"error": "internal service error"}, 500)
    wrapped.__name__ = f.__name__
    return wrapped


# Route for getting most listened songs
@recently_played_bp.route('/most_listened/songs', methods=['GET'])
@require_spotify
def get_most_listened_songs():
    try:
        recently_played = g.sp.current_user_recently_played(limit=50)
        items = recently_played.get('items', [])
        song_listens = {}
        
        for item in items:
            song_name = item['track']['name']
            song_listens[song_name] = song_listens.get(song_name, 0) + 1
        
        most_listened_songs = [{'name': song, 'listens': listens} for song, listens in song_listens.items()]
        sorted_songs = sorted(most_listened_songs, key=lambda x: x['listens'], reverse=True)

        return jsonify({'songs': sorted_songs})
    except Exception as e:
        print(f"Error in get_most_listened_songs: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"error": "Internal server error"}), 500

# Route for getting most listened artists
@recently_played_bp.route('/most_listened/artists', methods=['GET'])
@require_spotify
def get_most_listened_artists():
    try:
        recently_played = g.sp.current_user_recently_played(limit=50)
        items = recently_played.get('items', [])
        artist_listens = {}

        for item in items:
            for artist in item['track']['artists']:
                artist_name = artist['name']
                artist_listens[artist_name] = artist_listens.get(artist_name, 0) + 1
        
        most_listened_artists = [{'name': artist, 'listens': listens} for artist, listens in artist_listens.items()]
        
        # Sort by listens in descending order
        sorted_artists = sorted(most_listened_artists, key=lambda x: x['listens'], reverse=True)
        
        return jsonify({'artists': sorted_artists})
    except Exception as e:
        print(f"Error in get_most_popular_artists: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"error": "Internal server error"}), 500

# Route for getting most popular songs (based on popularity score)
@recently_played_bp.route('/most_popular/songs', methods=['GET'])
@require_spotify
def get_most_popular_songs():
    try:
        recently_played = g.sp.current_user_recently_played(limit=50)
        items = recently_played.get('items', [])
        songs = [
            {'name': item['track']['name'], 'score': item['track']['popularity']}
            for item in items
        ]        
        # Sort songs by popularity
        sorted_songs = sorted(songs, key=lambda x: x['score'], reverse=True)
        
        return jsonify({'songs': sorted_songs})
    except Exception as e:
        print(f"Error in get_most_popular_songs: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"error": "Internal server error"}), 500

# Route for getting most popular artists (based on track popularity)
@recently_played_bp.route('/most_popular/artists', methods=['GET'])
@require_spotify
def get_most_popular_artists():
    try:
        recently_played = g.sp.current_user_recently_played(limit=50)
        items = recently_played.get('items', [])
        
        # Collect artist popularity by averaging track popularity
        artist_popularity = {}

        for item in items:
            track_popularity = item['track']['popularity']
            
            # Iterate through the track's artists
            for artist in item['track']['artists']:
                artist_name = artist['name']
                
                if artist_name not in artist_popularity:
                    artist_popularity[artist_name] = {'total_score': 0, 'track_count': 0}
                
                # Accumulate popularity and count of tracks for each artist
                artist_popularity[artist_name]['total_score'] += track_popularity
                artist_popularity[artist_name]['track_count'] += 1
        
        # Calculate average popularity per artist
        avg_artist_popularity = [
            {'name': artist, 'score': data['total_score'] / data['track_count']}
            for artist, data in artist_popularity.items()
        ]
        
        # Sort artists by average popularity in descending order
        sorted_artists = sorted(avg_artist_popularity, key=lambda x: x['score'], reverse=True)

        return jsonify({'artists': sorted_artists})
    
    except Exception as e:
        print(f"Error in get_most_popular_artists: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"error": "Internal server error"}), 500

# Route for getting the average popularity score of songs
@recently_played_bp.route('/average/popularity', methods=['GET'])
@require_spotify
def get_average_popularity_score():
    try:
        recently_played = g.sp.current_user_recently_played(limit=50)
        items = recently_played.get('items', [])
        songs = get_song_info(items)
        
        # Calculate the average popularity score of the songs
        if songs:
            total_popularity = sum(song['popularity'] for song in songs)
            average_popularity = total_popularity / len(songs)
        else:
            average_popularity = 0
        
        return jsonify({'average_popularity': average_popularity})
    except Exception as e:
        print(f"Error in get_average_popularity_score: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"error": "Internal server error"}), 500