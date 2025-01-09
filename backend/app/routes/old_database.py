from flask import Blueprint, redirect, jsonify, request, session
from spotipy.oauth2 import SpotifyOAuth
from spotipy.cache_handler import FlaskSessionCacheHandler
from app.config import Config  # Import the Config class to access credentials

import 

DEFAULT_DATABASE = 'default_db_100000'
DATABASE_USED = DEFAULT_DATABASE

# use old database here for data!

old_database_bp = Blueprint('old_database', __name__)
cache_handler = FlaskSessionCacheHandler(session)
sp_oauth = SpotifyOAuth(
    client_id=Config.SPOTIFY_CLIENT_ID,
    client_secret=Config.SPOTIFY_CLIENT_SECRET,
    redirect_uri=Config.SPOTIFY_REDIRECT_URI,
    scope=Config.SPOTIFY_SCOPE,
    cache_handler=cache_handler,
    show_dialog=True
)

@app.route('/user_metrics', methods=['GET'])   #http://127.0.0.1:5000/user_metrics
def user_metrics():
    if (user_option == 0):
        sorting_type = "q"  # can be q or m
        history_path = "user_history.json"
        metrics: User_Metrics = ctrl.get_metrics_spotify_user(history=history_path, sorting_type=sorting_type)

        # Access the favorites attribute directly from the Artist_Metrics
        artist_list = metrics.artist_metrics.favorites

        #Access song metrics
        song_list = metrics.song_metrics.favorites
        #print(song_list[:10])

        # Access the pop_score attribute
        pop_score = metrics.pop_score


        # Create a response dictionary containing both the artist list and the pop score
        response = {
            "topArtists": artist_list[:5],  # get only the top 10 favorite artists
            "pop_score": pop_score,
            "topSongs": song_list[:5]
        }

        return jsonify(response)
    

    #THIS ARE THE FAKE USER PROFILES. YOU CAN CHANGE THE VARIABLES WITHIN get_metrics_fake_user() IF YOU WANT MORE VARIATIONS
    
    elif (user_option == 1):
        metrics: User_Metrics= ctrl.get_metrics_fake_user(history_size=100000, pop_level="c", sorting_type="q", database_name=DATABASE_USED)

        artist_list = metrics.artist_metrics.favorites
        song_list = metrics.song_metrics.favorites
        pop_score=100
        pop_score = metrics.pop_score
        print(pop_score)
        response = {
            "topArtists": artist_list[:5],
            "pop_score": pop_score,
            "topSongs": song_list[:5]
        }

        return jsonify(response)
    elif (user_option == 2):
        metrics: User_Metrics= ctrl.get_metrics_fake_user(history_size=100000, pop_level="b", sorting_type="q", database_name=DATABASE_USED)

        artist_list = metrics.artist_metrics.favorites
        song_list = metrics.song_metrics.favorites
        pop_score=100
        pop_score = metrics.pop_score
        print(pop_score)
        response = {
            "topArtists": artist_list[:5],
            "pop_score": pop_score,
            "topSongs": song_list[:5]
        }

        return jsonify(response)
    elif (user_option == 3):
        metrics: User_Metrics= ctrl.get_metrics_fake_user(history_size=100000, pop_level="a", sorting_type="q", database_name=DATABASE_USED)

        artist_list = metrics.artist_metrics.favorites
        song_list = metrics.song_metrics.favorites
        pop_score=100
        pop_score = metrics.pop_score
        print(pop_score)
        response = {
            "topArtists": artist_list[:5],
            "pop_score": pop_score,
            "topSongs": song_list[:5]
        }

        return jsonify(response)
    elif (user_option == 4):
        metrics: User_Metrics= ctrl.get_metrics_fake_user(history_size=100000, pop_level="c", sorting_type="m", database_name=DATABASE_USED)

        artist_list = metrics.artist_metrics.favorites
        song_list = metrics.song_metrics.favorites
        pop_score=100
        pop_score = metrics.pop_score
        print(pop_score)
        response = {
            "topArtists": artist_list[:5],
            "pop_score": pop_score,
            "topSongs": song_list[:5]
        }

        return jsonify(response)
    elif (user_option == 5):
        metrics: User_Metrics= ctrl.get_metrics_fake_user(history_size=100000, pop_level="b", sorting_type="m", database_name=DATABASE_USED)

        artist_list = metrics.artist_metrics.favorites
        song_list = metrics.song_metrics.favorites
        pop_score=100
        pop_score = metrics.pop_score
        print(pop_score)
        response = {
            "topArtists": artist_list[:5],
            "pop_score": pop_score,
            "topSongs": song_list[:5]
        }

        return jsonify(response)
    elif (user_option == 6):
        metrics: User_Metrics= ctrl.get_metrics_fake_user(history_size=100000, pop_level="a", sorting_type="m", database_name=DATABASE_USED)

        artist_list = metrics.artist_metrics.favorites
        song_list = metrics.song_metrics.favorites
        pop_score=100
        pop_score = metrics.pop_score
        print(pop_score)
        response = {
            "topArtists": artist_list[:5],
            "pop_score": pop_score,
            "topSongs": song_list[:5]
        }

        return jsonify(response)
    elif (user_option == 7):
        metrics: User_Metrics= ctrl.get_metrics_fake_user(history_size=200000, pop_level="c", sorting_type="q", database_name=DATABASE_USED)

        artist_list = metrics.artist_metrics.favorites
        song_list = metrics.song_metrics.favorites
        pop_score=100
        pop_score = metrics.pop_score
        print(pop_score)
        response = {
            "topArtists": artist_list[:5],
            "pop_score": pop_score,
            "topSongs": song_list[:5]
        }

        return jsonify(response)