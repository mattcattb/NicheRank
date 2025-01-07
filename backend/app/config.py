import os
from dotenv import load_dotenv
import secrets

load_dotenv()

class Config:
    SPOTIFY_CLIENT_ID = os.getenv('SPOTIFY_CLIENT_ID')
    SPOTIFY_CLIENT_SECRET = os.getenv('SPOTIFY_CLIENT_SECRET')
    SPOTIFY_REDIRECT_URI = os.getenv('SPOTIFY_REDIRECT_URI')
    SPOTIFY_SCOPE = os.getenv('SPOTIFY_SCOPE', 'user-read-recently-played')  # Default scope if not set in .env
    SECRET_KEY = secrets.token_hex(16)
    FRONTEND_URL = 'http://localhost:5173'  # Set this based on your environment





