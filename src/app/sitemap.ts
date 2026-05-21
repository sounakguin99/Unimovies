import type { MetadataRoute } from "next";

const BASE_URL = "https://unimovies.vercel.app";
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

/**
 * Dynamic sitemap generation for Unimovies.
 * Generates URLs for all static pages + top trending movies, TV shows, and popular people.
 * Google will crawl this at /sitemap.xml automatically.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/movie`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/tv`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/people`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/awards`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/trailers`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  // Dynamic movie pages - fetch popular + top-rated + now-playing
  let moviePages: MetadataRoute.Sitemap = [];
  try {
    const [popularRes, topRatedRes, nowPlayingRes] = await Promise.all([
      fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
      ),
      fetch(
        `https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=1`
      ),
      fetch(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=1`
      ),
    ]);

    const [popular, topRated, nowPlaying] = await Promise.all([
      popularRes.json(),
      topRatedRes.json(),
      nowPlayingRes.json(),
    ]);

    // Combine and deduplicate by id
    const allMovies = [
      ...(popular.results || []),
      ...(topRated.results || []),
      ...(nowPlaying.results || []),
    ];
    const uniqueMovieIds = [...new Set(allMovies.map((m: any) => m.id))];

    moviePages = uniqueMovieIds.map((id) => ({
      url: `${BASE_URL}/movie/${id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Sitemap: Error fetching movies", error);
  }

  // Dynamic TV pages - fetch popular + top-rated
  let tvPages: MetadataRoute.Sitemap = [];
  try {
    const [popularTVRes, topRatedTVRes] = await Promise.all([
      fetch(
        `https://api.themoviedb.org/3/tv/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
      ),
      fetch(
        `https://api.themoviedb.org/3/tv/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=1`
      ),
    ]);

    const [popularTV, topRatedTV] = await Promise.all([
      popularTVRes.json(),
      topRatedTVRes.json(),
    ]);

    const allTV = [
      ...(popularTV.results || []),
      ...(topRatedTV.results || []),
    ];
    const uniqueTVIds = [...new Set(allTV.map((t: any) => t.id))];

    tvPages = uniqueTVIds.map((id) => ({
      url: `${BASE_URL}/tv/${id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Sitemap: Error fetching TV shows", error);
  }

  // Dynamic People pages - popular people
  let peoplePages: MetadataRoute.Sitemap = [];
  try {
    const peopleRes = await fetch(
      `https://api.themoviedb.org/3/person/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
    );
    const people = await peopleRes.json();

    peoplePages = (people.results || []).map((p: any) => ({
      url: `${BASE_URL}/people/${p.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error("Sitemap: Error fetching people", error);
  }

  return [...staticPages, ...moviePages, ...tvPages, ...peoplePages];
}
