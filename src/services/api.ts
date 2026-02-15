/**
 * Centralized API service layer
 * Provides a consistent interface for all API calls with error handling and caching support.
 */

import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

/**
 * Create a configured axios instance for TMDB API
 */
const tmdbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
  timeout: 10000,
});

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

/**
 * Generic fetch function with error handling
 */
async function fetchFromTMDB<T>(
  endpoint: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  try {
    const response: AxiosResponse<T> = await tmdbClient.get(endpoint, config);
    return {
      data: response.data,
      error: null,
      status: response.status,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        data: null,
        error: error.response?.data?.status_message || error.message,
        status: error.response?.status || 500,
      };
    }
    return {
      data: null,
      error: "An unexpected error occurred",
      status: 500,
    };
  }
}

/**
 * Movie API endpoints
 */
export const movieApi = {
  getTrending: (timeWindow: "day" | "week" = "week") =>
    fetchFromTMDB(`/trending/movie/${timeWindow}`),

  getPopular: (page = 1) =>
    fetchFromTMDB("/movie/popular", { params: { page } }),

  getTopRated: (page = 1) =>
    fetchFromTMDB("/movie/top_rated", { params: { page } }),

  getNowPlaying: (page = 1) =>
    fetchFromTMDB("/movie/now_playing", { params: { page } }),

  getUpcoming: (page = 1) =>
    fetchFromTMDB("/movie/upcoming", { params: { page } }),

  getDetails: (id: number) =>
    fetchFromTMDB(`/movie/${id}`),

  getCredits: (id: number) =>
    fetchFromTMDB(`/movie/${id}/credits`),

  getSimilar: (id: number) =>
    fetchFromTMDB(`/movie/${id}/similar`),

  search: (query: string, page = 1) =>
    fetchFromTMDB("/search/movie", { params: { query, page } }),
};

/**
 * TV Show API endpoints
 */
export const tvApi = {
  getTrending: (timeWindow: "day" | "week" = "week") =>
    fetchFromTMDB(`/trending/tv/${timeWindow}`),

  getPopular: (page = 1) =>
    fetchFromTMDB("/tv/popular", { params: { page } }),

  getTopRated: (page = 1) =>
    fetchFromTMDB("/tv/top_rated", { params: { page } }),

  getDetails: (id: number) =>
    fetchFromTMDB(`/tv/${id}`),

  getCredits: (id: number) =>
    fetchFromTMDB(`/tv/${id}/credits`),

  search: (query: string, page = 1) =>
    fetchFromTMDB("/search/tv", { params: { query, page } }),
};

/**
 * People API endpoints
 */
export const peopleApi = {
  getPopular: (page = 1) =>
    fetchFromTMDB("/person/popular", { params: { page } }),

  getDetails: (id: number) =>
    fetchFromTMDB(`/person/${id}`),

  getCredits: (id: number) =>
    fetchFromTMDB(`/person/${id}/combined_credits`),

  search: (query: string, page = 1) =>
    fetchFromTMDB("/search/person", { params: { query, page } }),
};

export default {
  movie: movieApi,
  tv: tvApi,
  people: peopleApi,
};
