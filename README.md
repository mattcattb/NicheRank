# Niche Song Ranking

## Project Overview

This project analyzes a Spotify user's listening habits and compares them to a large dataset of one million playlists to determine if they are listening to more popular or niche music. Through our web application, users can log into their Spotify account, view their top songs and artists, and see how their music tastes rank in comparison to a global dataset.

This global dataset is parsed from the Spotify 1 Million Playlists database using our own script and functions. This data is then compared with users listening history to find out a users customized popularity score.


## Setup Instructions

### Setting Up Spotify Authentication

To authenticate users via Spotify, you'll need to configure the Spotify API Developer settings:

1. **Create a Spotify Developer Account**:
    - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications).
    - Log in with your Spotify account, or create one if you don't have one yet.

2. **Create a New Application**:
    - In the Spotify Developer Dashboard, click on "Create an App."
    - Fill out the app's details:
        - **App Name**: Choose a name for your app.
        - **App Description**: Provide a short description (optional).
        - **Redirect URI**: Add the URI where users will be redirected after authentication. For local development, you can use `http://localhost:5000/callback`.
    - Agree to the terms and conditions, and click "Create."

3. **Get Your Client ID and Client Secret**:
    - After creating the app, you'll be taken to a page with your **Client ID** and **Client Secret**.
    - Keep these credentials safe as you'll need them for authentication.

4. **Configure Your Backend**:
    - In `spotify.py`, replace the placeholder values for `CLIENT_ID`, `CLIENT_SECRET`, and `REDIRECT_URI` with the ones you received from the Spotify Developer Dashboard.

5. **Set Up Authentication**:
    - Make sure the `user_login` variable in `spotify.py` (line 32) is set to 0 to use manual credentials (for development), or set it to 1-7 to generate fake user profiles for testing.
    - You must log in with the credentials provided (username: `AmandaBrannon`, password: `Workingonit1!`) while in development mode. If you want to grant access to more users, provide their name and email, and I can allow up to 25 users access.

6. **Login and Authorization**:
    - When running the app, the user will be prompted to log in via Spotify and grant permissions for your application to access their account data.


### Backend Setup

To setup the backend which includes the Flask Server and Spotify Parsed Dataset, do the following:

1. **Install Backend Dependencies**:
    ```bash
    cd backend
    pip install -r requirements.txt
    ```

2. **Set Database**:
- A default database is already implemented. To use a different database, change the DATABASE_USED variable in spotify.py on line 35 to the name of your database

3. **Run Flask Script**: Open second terminal and in backend run
    ```bash
    python3 app.py
    ```
    The backend should now be running at http://127.0.0.1:5000.

### Frontend Setup
To setup the react frontend:
1. **Install Frontend Dependencies**:
    ```bash
    cd frontend
    npm install
    ```
2. **Run React Development Server**:
    ```bash
    npm start
    ```
3. Go to ```http://localhost:5174``` for frontend.

## General Use Instructions

1. A default database is already implemented. If you would like to change this, see Dataset to Database Extraction below. To then use that database, change line 35 of spotify.py "DATABASE_USED = 'yourDatabaseNameHere'"
7. To use the Spotify API, leave spotify.py line 32 "user_login" as 0. You must log in with these credentials, as Spotify for Developers only lets manually authorized users log in on unpublished projects. [username: AmandaBrannon pw: Workingonit1!] (you can see what I have been listening to! If you give me your full name and email, I can allow up to 25 people access while it is in development mode). Change user_login to 1 through 7, and it will randomly generate a fake user profile with 100000 points (or more) of data, as well as use different sorting types (q=quick, m=merge). If you really want to, these can be manually changed for even more combinations for various user profiles

## Dataset to Database Extraction

Due to the size of the database, we have already created it on our own. If you would like to generate your own database, do the following: 

1. Download zip from https://drive.google.com/drive/folders/1P_A_GMWGeT8Z4Lz1Z0E65n_gdTMMibZ9?usp=sharing
2. Unzip file into the NicheRank/playlist_database folder.
3. Run the playlist_parse.py as   
    playlist_parse.py --load_percent 0.3 --profile True 
    where load_percent is % of million playlists to load and profile is if to display how much time it takes.

Keep in mind, it takes around 1.5 minutes to parse 10% of the database, so either keep the value low or give it some time.

## Project Details

### Problem Statement
The goal of the project was to answer the question: "Is a Spotify user listening to popular or niche music in comparison with a large dataset of playlists?" By analyzing the user's music preferences and comparing them to global data, we can provide insights into how popular or obscure their music tastes are. We also hope to allow users to quickly see their listened to music.

### Motivation
Our motivation was that Spotify does not have any sort of metrics as to how popular your current listening history is. Through our web application, a user is able to sign into their Spotify account, give access permission, and then be presented with how popular their music taste is, as well as their top songs and artists.


## Tools/Languages/Libraries Used

### 1. **Frontend**
- [ReactJS:](https://react.dev/) Utilize ReactJS, a JavaScript framework that provides a foundation for developing dynamic and responsive web applications, alongside **Typescript** for enhanced type safety and better development experience. We use Tailwind and Material UI for clean and concise UI options.


### 2. **Backend**

- [FLASK:](https://flask.palletsprojects.com/en/3.0.x/) Used Flask, a lightweight Python framework, to interact with the Spotify API, manage user authentication, retrieve user data, and serve it to the frontend application

### 3. **Development Tools**
- [Visual Studio Code:](https://code.visualstudio.com/) A versatile code editor that provides debugging, task running, and version control for streamlined development.

- [Github:](https://github.com/jlopezmarti20/NicheRank) Version control and collaboration were managed using GitHub, enabling effective team collaboration and code tracking.


## Algorithms and Comparison Methodology

Our project employs several advanced algorithms and techniques to analyze user listening history and compare it with global playlists:

### 1. Data Parsing and Compression
* The million-playlist dataset was efficiently parsed and processed using custom algorithms to extract relevant information.
* Compression and serialization techniques were implemented to reduce the size of the dataset while retaining critical information for analysis.
 
### 2. Popularity Scoring
* A popularity score is computed by comparing the frequency of user-listened songs and artists against the global playlist dataset.

* Metrics account for both local and global trends, providing a balanced assessment of how niche a user's music taste is.

### 3. Sorting Algorithms

* Custom implementations of quicksort and mergesort were developed to efficiently sort user listening data:
    * Quicksort: Optimized for small datasets and quick comparisons.
    * Mergesort: Designed for stable, large-scale sorting with high accuracy.
* These algorithms enable sorting by local and global listens, allowing for detailed insights into user preferences.

### 4. Comparison Framework

* An inheritance-based structure was designed for songs, artists, and their corresponding statistics, ensuring modularity and scalability.
* This framework facilitates seamless data comparison, serialization into JSON for frontend integration, and robust population scoring mechanisms.
