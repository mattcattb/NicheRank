# Helper function to get artist information
def get_artist_info(items):
    artists = []
    for item in items:
        for artist in item['track']['artists']:
            artists.append(artist['name'])
    return artists

# Helper function to get song information
def get_song_info(items):
    songs = []
    for item in items:
        track = item['track']
        songs.append({'name': track['name'], 'popularity': track['popularity'], 'id': track['id']})
    return songs