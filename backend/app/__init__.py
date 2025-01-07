import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from app.config import Config  # Import the Config class to access credentials

def create_app():
    load_dotenv()  # Load environment variables

    app = Flask(__name__)
    app.config['SECRET_KEY'] = Config.SECRET_KEY 
    CORS(app)

    from app.routes.auth_spotify import auth_spotify_bp
    from app.routes.recently_played import recently_played_bp

    app.register_blueprint(auth_spotify_bp, url_prefix='/auth')
    app.register_blueprint(recently_played_bp, url_prefix='/recently_played')

    return app
