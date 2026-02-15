import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Movie, TVShow } from "@/types";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

interface TMDBState {
  topRatedMovies: Movie[];
  popularMovies: Movie[];
  upcomingMovies: Movie[];
  popularTvShows: TVShow[];
  popularAnimationTvShows: TVShow[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null | undefined;
}

// Function to fetch all pages of results concurrently
const fetchAllPages = async (url: string, maxPages = 5) => {
    let allResults: any[] = [];
    const requests: Promise<any>[] = [];

    for (let page = 1; page <= maxPages; page++) {
        requests.push(fetch(`${url}&page=${page}`).then(response => response.json()));
    }

    const results = await Promise.all(requests);

    results.forEach(data => {
        allResults = allResults.concat(data.results);
    });

    return allResults;
};

// Thunks to fetch data
export const fetchTopRatedMovies = createAsyncThunk<Movie[]>('tmdb/fetchTopRatedMovies', async () => {
    const response = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results;
});

export const fetchPopularMovies = createAsyncThunk<Movie[]>('tmdb/fetchPopularMovies', async () => {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results;
});

export const fetchUpcomingMovies = createAsyncThunk<Movie[]>('tmdb/fetchUpcomingMovies', async (_, { getState }) => {
    const state = getState() as { tmdb: TMDBState };
    if (state.tmdb.upcomingMovies.length > 0) {
        return state.tmdb.upcomingMovies; // Return cached data if available
    }

    const url = `${BASE_URL}/movie/upcoming?api_key=${API_KEY}`;
    const allResults = await fetchAllPages(url);
    const today = new Date().toISOString().split('T')[0];
    const futureMovies = allResults.filter((movie: Movie) => movie.release_date >= today);
    return futureMovies;
});

export const fetchPopularTvShows = createAsyncThunk<TVShow[]>('tmdb/fetchPopularTvShows', async () => {
    const response = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results;
});

export const fetchPopularAnimationTvShows = createAsyncThunk<TVShow[]>('tmdb/fetchPopularAnimationTvShows', async () => {
    const response = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&sort_by=popularity.desc&with_genres=16`);
    const data = await response.json();
    return data.results;
});

// Slice to manage TMDB data
const initialState: TMDBState = {
    topRatedMovies: [],
    popularMovies: [],
    upcomingMovies: [],
    popularTvShows: [],
    popularAnimationTvShows: [],
    status: 'idle',
    error: null,
};

const tmdbSlice = createSlice({
    name: 'tmdb',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPopularTvShows.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPopularTvShows.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.popularTvShows = action.payload;
            })
            .addCase(fetchPopularTvShows.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchPopularAnimationTvShows.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPopularAnimationTvShows.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.popularAnimationTvShows = action.payload;
            })
            .addCase(fetchPopularAnimationTvShows.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchPopularMovies.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPopularMovies.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.popularMovies = action.payload;
            })
            .addCase(fetchPopularMovies.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchUpcomingMovies.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUpcomingMovies.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.upcomingMovies = action.payload;
            })
            .addCase(fetchUpcomingMovies.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchTopRatedMovies.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTopRatedMovies.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.topRatedMovies = action.payload;
            })
            .addCase(fetchTopRatedMovies.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default tmdbSlice.reducer;
