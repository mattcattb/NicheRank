from flask import Blueprint, redirect, url_for, request, session
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

@auth_spotify_bp.route('/login')
def login():
    if not sp_oauth.validate_token(cache_handler.get_cached_token()):
        auth_url = sp_oauth.get_authorize_url()
        return redirect(auth_url)
    return redirect(f"{Config.FRONTEND_URL}/score")

@auth_spotify_bp.route('/callback')
def callback():
    sp_oauth.get_access_token(request.args['code'])
    return redirect(f"{Config.FRONTEND_URL}/score")
