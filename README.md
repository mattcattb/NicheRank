# NicheRank

A Spotify-authenticated app for scoring how niche or mainstream a listener's music taste is.

![NicheRank Spotify listening dashboard](docs/images/niche-rank.png)

## About

NicheRank compares a user's Spotify listening history against a parsed playlist dataset to estimate how common or niche their songs and artists are. The app combines a React frontend, Flask backend, Spotify OAuth, custom parsing scripts, and sorting/comparison algorithms.

## Tech Stack

- React
- TypeScript
- Flask
- Python
- Spotify Web API
- Custom playlist parsing
- Quicksort and mergesort implementations

## Features

- Spotify login and listening-history import.
- Top song and artist views.
- Popularity scoring against a larger playlist dataset.
- Dataset parsing and serialization utilities.
- Fake-user modes for testing scoring behavior without a live Spotify session.
- Custom sorting implementations for comparing listening history.

## My Role

I worked on the Flask API, Spotify integration, playlist parsing, scoring model, sorting algorithms, and frontend views for exploring a listener's results.

## Running Locally

Create a Spotify Developer app and configure its redirect URI for local development, for example `http://localhost:5000/callback`.

Backend:

```bash
git clone https://github.com/mattcattb/NicheRank.git
cd NicheRank/backend
pip install -r requirements.txt
python3 app.py
```

Frontend:

```bash
cd ../frontend
npm install
npm run dev
```

The Flask API runs on `http://127.0.0.1:5000`. The frontend runs through Vite.

## Dataset Notes

The project can use a prebuilt dataset or generate one from the Spotify Million Playlist Dataset. Dataset generation is intentionally separate from the normal app startup because parsing a large percentage of the source data takes time.

```bash
python3 playlist_parse.py --load_percent 0.3 --profile True
```

## Project Notes

This is an older data structures project, so some code is intentionally explicit to show the parsing, scoring, and sorting work. For public use, keep Spotify credentials in local environment files and do not commit them.
