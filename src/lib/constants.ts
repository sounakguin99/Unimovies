/**
 * Application-wide constants
 */

export const APP_CONFIG = {
  name: "Unimovies",
  fullName: "Unimovies - Your Ultimate Movie Destination",
  description:
    "Discover movies, TV shows, and celebrities. Your ultimate entertainment companion.",
  themeColor: "#111827",
  backgroundColor: "#000000",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://unimovies.vercel.app",
} as const;

export const CACHE_CONFIG = {
  /** Stale-while-revalidate duration for API responses (seconds) */
  apiSWR: 3600,
  /** Cache-first duration for static assets (seconds) */
  staticCache: 86400 * 30, // 30 days
  /** Cache-first duration for images (seconds) */
  imageCache: 86400 * 7, // 7 days
} as const;

export const TMDB_CONFIG = {
  imageBaseUrl: "https://image.tmdb.org/t/p",
  posterSizes: {
    small: "w185",
    medium: "w342",
    large: "w500",
    original: "original",
  },
  backdropSizes: {
    small: "w300",
    medium: "w780",
    large: "w1280",
    original: "original",
  },
} as const;
