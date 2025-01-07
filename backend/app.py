import os
import sys
import json
from flask import Flask, request, redirect, session, url_for, jsonify
from spotipy import Spotify
from spotipy.oauth2 import SpotifyOAuth
from spotipy.cache_handler import FlaskSessionCacheHandler
from flask_cors import CORS
from dotenv import load_dotenv  # Import dotenv to load .env file


sys.path.append("algo_src")

import control as ctrl
from analyze_history import User_Metrics

#this is how to start the file with Flask, then create a randomized secret key
app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = os.urandom(64)


# Fetch sensitive keys from environment variables
load_dotenv()
client_id = os.getenv('SPOTIFY_CLIENT_ID')
client_secret = os.getenv('SPOTIFY_CLIENT_SECRET')
redirect_uri = os.getenv('SPOTIFY_REDIRECT_URI')
scope = 'user-read-recently-played'

#CHANGE THIS OPTION FOR DIFFERENT USERS.
# 0 is spotify login. (spotify accounts need to be authenticated in SfD) login with user: Amanda Brannon pw: Workingonit1!
# 1 through 7 are differently generated users with 100000 points (or more) of data
user_option = 0

DEFAULT_DATABASE = 'default_db_100000'
DATABASE_USED = DEFAULT_DATABASE

#this makes a new session upon opening the page- this is important as the authorization token is only temporary
cache_handler = FlaskSessionCacheHandler(session)
sp_oauth = SpotifyOAuth(
    client_id=client_id,
    client_secret=client_secret,
    redirect_uri=redirect_uri,
    scope=scope,
    cache_handler=cache_handler,
    show_dialog=True
)
sp = Spotify(auth_manager=sp_oauth)

#this is the landing page. it checks whether you have logged in yet. if you have (you probably haven't) it goes straight to collecting
#data and automatically rerouting you to your score page. It HAS to redirect to auth_url, or else you will get stuck in a deadlock.
#that auth_url contains the client id and redirect_uri and looks like 
#this: https://accounts.spotify.com/authorize?client_id=52500f70b3534d0bae16a8efac5a70af&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fcallback&scope=user-read-recently-played&show_dialog=True
@app.route('/')
def home():
    if (user_option == 0):
        if not sp_oauth.validate_token(cache_handler.get_cached_token()):
            auth_url = sp_oauth.get_authorize_url()
            return redirect(auth_url)
        return redirect(url_for('get_recently_played'))
    
    else:
        return redirect(url_for('get_recently_played'))


#this callback function happens when you have logged in- it authorizes with your access token and reroutes you to collecting data
#and going to the score page
@app.route('/callback')
def callback():
    sp_oauth.get_access_token(request.args['code'])
    return redirect(url_for('get_recently_played'))


#this happens so fast you never see the page! this checks again to make sure you are authorized. It then takes the 50 most recently
#played songs and puts them in a .json file to be taken in by another file for analysis. the redirectUri is manually changed
#so that you can get to your score page (this redirect connection point took us hours to figure out.)
@app.route('/get_recently_played')
def get_recently_played():
    if (user_option == 0):
        if not sp_oauth.validate_token(cache_handler.get_cached_token()):
            auth_url = sp_oauth.get_authorize_url()
            return redirect(auth_url)

        data = sp.current_user_recently_played()
        
        file_path = "user_history.json"
        with open(file_path, "w") as f:
            json.dump(data, f)

    #return redirect(url_for('fake_user1'))
    redirect_uri = 'http://127.0.0.1:5173/score'
    return redirect(redirect_uri)

@app.route('/recently_listened/popular', methods=['GET'])
def get_recently_listened_popular():
    if not sp_oauth.validate_token(cache_handler.get_cached_token()):
        return redirect(sp_oauth.get_authorize_url())
    
    # Fetch recently played tracks
    recently_played = sp.current_user_recently_played(limit=50)
    items = recently_played.get('items', [])
    
    # Extract artist and song data with popularity
    songs = []
    artists = {}
    for item in items:
        track = item['track']
        songs.append({
            'name': track['name'],
            'popularity': track['popularity'],
            'artist': ', '.join(artist['name'] for artist in track['artists'])
        })
        for artist in track['artists']:
            artists[artist['name']] = max(artist.get('popularity', 0), artists.get(artist['name'], 0))
    
    # Sort by popularity
    sorted_songs = sorted(songs, key=lambda x: x['popularity'], reverse=True)
    sorted_artists = sorted(artists.items(), key=lambda x: x[1], reverse=True)
    
    return jsonify({
        'songs': sorted_songs,
        'artists': [{'name': name, 'popularity': popularity} for name, popularity in sorted_artists]
    })

@app.route('/recently_listened/most_listened', methods=['GET'])
def get_most_listened():
    if not sp_oauth.validate_token(cache_handler.get_cached_token()):
        return redirect(sp_oauth.get_authorize_url())
    
    # Fetch recently played tracks
    recently_played = sp.current_user_recently_played(limit=50)
    items = recently_played.get('items', [])
    
    # Count the frequency of each song
    song_counts = {}
    for item in items:
        track = item['track']
        song_name = track['name']
        song_counts[song_name] = song_counts.get(song_name, 0) + 1
    
    # Sort by frequency
    sorted_songs = sorted(song_counts.items(), key=lambda x: x[1], reverse=True)
    
    return jsonify({
        'most_listened_songs': [{'name': name, 'count': count} for name, count in sorted_songs]
    })


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


#this never happens since we redirect to the frontend :)
@app.route('/logout')
def logout():
    session.clear()
    return redirect(url)

#the backbone of all python files
if __name__ == '__main__':
    app.run(debug=True)