from flask import Blueprint, redirect, jsonify, request, session
from spotipy.oauth2 import SpotifyOAuth
from spotipy.cache_handler import FlaskSessionCacheHandler
from app.config import Config  # Import the Config class to access credentials


auth_spotify_bp = Blueprint('auth_spotify', __name__)
cache_handler = FlaskSessionCacheHandler(session)
sp_oauth = SpotifyOAuth(
    client_id=Config.SPOTIFY_CLIENT_ID,
    client_secret=Config.SPOTIFY_CLIENT_SECRET,
    redirect_uri=Config.SPOTIFY_REDIRECT_URI,
    scope=Config.SPOTIFY_SCOPE,
    cache_handler=cache_handler,
    show_dialog=True
)

@auth_spotify_bp.route('/url')
def get_auth_url():
    
    auth_url = sp_oauth.get_authorize_url()
    return jsonify({"auth_url":auth_url})

@auth_spotify_bp.route('/callback')
def callback():
    token_info = sp_oauth.get_access_token(request.args['code'])
    cache_handler.save_token_to_cache(token_info)
    return redirect(f"{Config.FRONTEND_URL}/score")
