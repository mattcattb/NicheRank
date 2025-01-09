from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from app.config import Config  # Import the Config class to access credentials

def create_app():
    load_dotenv()  # Load environment variables

    app = Flask(__name__)
    app.config['SECRET_KEY'] = Config.SECRET_KEY 
    
    # Updated CORS configuration with explicit headers
    CORS(app, 
         resources={r"/*": {
        "origins": ["http://localhost:5173"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True,
        "expose_headers": ["Access-Control-Allow-Origin"],
        "max_age": 600
    }})
    
    
    # Add after_request handler to ensure CORS headers
    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response
    

    
    from app.routes.auth_spotify import auth_spotify_bp
    from app.routes.recently_played import recently_played_bp
    from app.routes.old_database import old_database_bp

    app.register_blueprint(auth_spotify_bp, url_prefix='/auth')
    app.register_blueprint(recently_played_bp, url_prefix='/recently_played')
    app.register_blueprint(old_database_bp, url_prefix='/old_db')

    return app
