"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import SearchTrailers from "./SearchTrailers";


const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// --- TMDB Genre IDs ---
const GENRES = [
  { id: "all",         label: "All",             tmdbId: null },
  { id: "action",      label: "Action",          tmdbId: 28 },
  { id: "adventure",   label: "Adventure",       tmdbId: 12 },
  { id: "animation",   label: "Animation",       tmdbId: 16 },
  { id: "comedy",      label: "Comedy",          tmdbId: 35 },
  { id: "crime",       label: "Crime",           tmdbId: 80 },
  { id: "documentary", label: "Documentary",     tmdbId: 99 },
  { id: "drama",       label: "Drama",           tmdbId: 18 },
  { id: "family",      label: "Family",          tmdbId: 10751 },
  { id: "fantasy",     label: "Fantasy",         tmdbId: 14 },
  { id: "history",     label: "History",         tmdbId: 36 },
  { id: "horror",      label: "Horror",          tmdbId: 27 },
  { id: "music",       label: "Music",           tmdbId: 10402 },
  { id: "mystery",     label: "Mystery",         tmdbId: 9648 },
  { id: "romance",     label: "Romance",         tmdbId: 10749 },
  { id: "scifi",       label: "Sci-Fi",          tmdbId: 878 },
  { id: "tvmovie",     label: "TV Movie",        tmdbId: 10770 },
  { id: "thriller",    label: "Thriller",        tmdbId: 53 },
  { id: "war",         label: "War",             tmdbId: 10752 },
  { id: "western",     label: "Western",         tmdbId: 37 },
];

const DEFAULT_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi"   },
];

const VIDEO_TYPES = [
  { id: "Trailer", label: "Trailers" },
  { id: "Teaser",  label: "Teasers"  },
  { id: "Clip", label: "Clips" },
  { id: "Featurette", label: "Featurettes" },
  { id: "Behind the Scenes", label: "Behind the Scenes" },
  { id: "Bloopers", label: "Bloopers" },
];

interface TrailerItem {
  key: string;
  name: string;
  type: string;
  movieTitle: string;
  moviePoster: string;
  published_at: string;
}

// ── Helpers ──
function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} days ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} months ago`;
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} years ago`;
}

async function fetchMoviesByDiscover(lang: string, tmdbGenreId: number | null): Promise<any[]> {
  const genreParam = tmdbGenreId ? `&with_genres=${tmdbGenreId}` : "";
  const pages = await Promise.all(
    [1, 2, 3].map((p) =>
      fetch(
        `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_original_language=${lang}&sort_by=popularity.desc&page=${p}&vote_count.gte=50${genreParam}`
      ).then((r) => r.json())
    )
  );
  return pages.flatMap((p) => p.results ?? []);
}

async function fetchBestVideo(movieId: number, vidType: string): Promise<TrailerItem | null> {
  try {
    const res = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`);
    const json = await res.json();
    const match = (json.results as any[])
      .filter((v) => v.type === vidType && v.site === "YouTube")
      .sort(
        (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
      )[0];
    return match ?? null;
  } catch {
    return null;
  }
}

export default function TrailersClient() {
  const [genre, setGenre]             = useState("all");
  const [lang, setLang]               = useState("en");
  const [vidType, setVidType]         = useState("Trailer");
  const [trailers, setTrailers]       = useState<TrailerItem[]>([]);
  const [playingVideo, setPlayingVideo] = useState<TrailerItem | null>(null);
  const [loading, setLoading]         = useState(true);
  const [languages, setLanguages]     = useState(DEFAULT_LANGUAGES);

  // Search states
  const [searchMovies, setSearchMovies] = useState<any[] | null>(null);
  const [searchTerm, setSearchTerm]   = useState("");

  const runIdRef = useRef(0);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const res = await fetch(`${BASE_URL}/configuration/languages?api_key=${API_KEY}`);
        if (!res.ok) throw new Error("Failed to fetch languages");
        const data = await res.json();
        const sorted = data
          .map((item: any) => ({
            code: item.iso_639_1,
            label: item.english_name || item.name || item.iso_639_1,
          }))
          .sort((a: any, b: any) => a.label.localeCompare(b.label));
        setLanguages(sorted);
      } catch (err) {
        console.error("Failed to fetch TMDB languages:", err);
      }
    };
    fetchLanguages();
  }, []);

  const fetchTrailers = useCallback(async () => {
    const runId = ++runIdRef.current; 

    setLoading(true);
    setTrailers([]);
    setPlayingVideo(null);

    try {
      const selectedGenre = GENRES.find((g) => g.id === genre);
      
      let movies: any[] = [];
      if (searchMovies !== null) {
        movies = searchMovies;
        
        // Client-side filtering by genre
        if (selectedGenre && selectedGenre.tmdbId) {
          movies = movies.filter((m: any) => m.genre_ids?.includes(selectedGenre.tmdbId));
        }
      } else {
        movies = await fetchMoviesByDiscover(lang, selectedGenre?.tmdbId ?? null);
      }

      if (runId !== runIdRef.current) return;

      const seen = new Set<number>();
      const subset: any[] = [];
      for (const m of movies) {
        if (!seen.has(m.id)) { seen.add(m.id); subset.push(m); }
        if (subset.length >= 30) break; // Fetch up to 30 for a nice grid
      }

      const videoResults = await Promise.all(
        subset.map(async (movie) => {
          const video = await fetchBestVideo(movie.id, vidType);
          if (!video) return null;
          return {
            key: video.key,
            name: video.name,
            type: video.type,
            movieTitle: movie.title || movie.original_title,
            moviePoster: movie.poster_path ?? "",
            published_at: video.published_at,
          } as TrailerItem;
        })
      );

      if (runId !== runIdRef.current) return;

      const valid = videoResults.filter(Boolean) as TrailerItem[];
      
      // Filter out duplicate video keys to prevent React key collision and duplicate displays
      const seenVideoKeys = new Set<string>();
      const uniqueTrailers: TrailerItem[] = [];
      for (const item of valid) {
        if (!seenVideoKeys.has(item.key)) {
          seenVideoKeys.add(item.key);
          uniqueTrailers.push(item);
        }
      }
      // Sort trailers from newest to oldest based on publishing date
      uniqueTrailers.sort(
        (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
      );
      setTrailers(uniqueTrailers);
    } catch (err) {
      console.error("TrailersClient fetch error:", err);
    } finally {
      if (runId === runIdRef.current) setLoading(false);
    }
  }, [genre, lang, vidType, searchMovies]);

  useEffect(() => {
    fetchTrailers();
  }, [fetchTrailers]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (playingVideo) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [playingVideo]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Cinematic Hero Header */}
      <div className="relative w-full h-[30vh] md:h-[40vh] flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[url('/Images/ok.jpeg')] bg-cover bg-center opacity-30 filter blur-md transform scale-105"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/80 to-transparent"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-10">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-3 drop-shadow-2xl">
            Popular <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Trailers</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-lg font-medium drop-shadow-md">
            Watch the latest movie trailers, teasers, and clips
          </p>
        </div>
      </div>

      {/* Centered Search Bar */}
      <div className="flex justify-center mb-8">
        <SearchTrailers 
          lang={lang} 
          onSearch={(movies, query) => {
            setSearchMovies(movies);
            setSearchTerm(query);
          }} 
          onClear={() => {
            setSearchMovies(null);
            setSearchTerm("");
          }}
        />
      </div>

      {/* ── Filter Bar (YouTube styled chips) ── */}
      <div className="sticky top-[64px] z-30 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-white/10 py-3 px-4 md:px-8">
        <div className="w-full max-w-[2000px] mx-auto flex items-center justify-between gap-3">
          
          {/* Scrollable Genres */}
          <div 
            className="flex items-center gap-3 overflow-x-auto scrollbar-none flex-1 min-w-0 pr-4 max-w-[55vw] sm:max-w-[65vw] md:max-w-[70vw] lg:max-w-[75vw] xl:max-w-[1200px]"
            style={{ scrollbarWidth: 'none' }}
          >
            {GENRES.map((g) => (
              <button
                key={g.id}
                onClick={() => setGenre(g.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  genre === g.id
                    ? "bg-white text-black hover:bg-gray-200"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
          
          {/* Stationary Dropdowns */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-px h-6 bg-white/20 mx-2"></div>
            
            <div className="flex-shrink-0">
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-white/10 text-white text-sm font-medium px-4 py-1.5 rounded-lg outline-none cursor-pointer hover:bg-white/20 transition-colors appearance-none pr-8 relative"
                style={{ 
                  backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', 
                  backgroundRepeat: 'no-repeat', 
                  backgroundPosition: 'right .7rem top 50%', 
                  backgroundSize: '.65rem auto' 
                }}
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code} className="bg-[#0a0a0a] text-white">
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-px h-6 bg-white/20 hidden sm:block"></div>

            <div className="flex-shrink-0">
              <select
                value={vidType}
                onChange={(e) => setVidType(e.target.value)}
                className="bg-white/10 text-white text-sm font-medium px-4 py-1.5 rounded-lg outline-none cursor-pointer hover:bg-white/20 transition-colors appearance-none pr-8 relative"
                style={{ 
                  backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', 
                  backgroundRepeat: 'no-repeat', 
                  backgroundPosition: 'right .7rem top 50%', 
                  backgroundSize: '.65rem auto' 
                }}
              >
                {VIDEO_TYPES.map((vt) => (
                  <option key={vt.id} value={vt.id} className="bg-[#0a0a0a] text-white">
                    {vt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="max-w-[2000px] mx-auto px-4 md:px-8 py-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-4 gap-y-10">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="w-full aspect-video rounded-xl overflow-hidden">
                  <Skeleton height="100%" baseColor="#272727" highlightColor="#3f3f3f" />
                </div>
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-full flex-shrink-0 overflow-hidden">
                    <Skeleton height="100%" baseColor="#272727" highlightColor="#3f3f3f" />
                  </div>
                  <div className="flex-1">
                    <Skeleton width="90%" height={16} baseColor="#272727" highlightColor="#3f3f3f" className="mb-2" />
                    <Skeleton width="60%" height={14} baseColor="#272727" highlightColor="#3f3f3f" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : trailers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <svg className="w-24 h-24 text-gray-700 mb-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21.58 8.01a2.6 2.6 0 00-1.83-1.85C18.14 5.71 12 5.71 12 5.71s-6.14 0-7.75.45A2.6 2.6 0 002.42 8.01C1.97 9.66 1.97 12 1.97 12s0 2.34.45 3.99a2.6 2.6 0 001.83 1.85c1.61.45 7.75.45 7.75.45s6.14 0 7.75-.45a2.6 2.6 0 001.83-1.85c.45-1.65.45-3.99.45-3.99s0-2.34-.45-3.99zM9.97 14.59V9.41L14.96 12l-4.99 2.59z"/>
            </svg>
            <h3 className="text-2xl font-bold text-white mb-2">No results found</h3>
            <p className="text-gray-400">Try adjusting your filters to find more videos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-4 gap-y-10">
            {trailers.map((trailer) => (
              <div 
                key={trailer.key} 
                className="flex flex-col cursor-pointer group"
                onClick={() => setPlayingVideo(trailer)}
              >
                {/* Thumbnail */}
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#272727]">
                  <img 
                    src={`https://img.youtube.com/vi/${trailer.key}/mqdefault.jpg`}
                    alt={trailer.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute bottom-1.5 right-1.5 bg-black/80 px-1.5 py-0.5 rounded text-xs font-medium tracking-wide">
                    {trailer.type}
                  </div>
                </div>
                
                {/* Info */}
                <div className="flex gap-3 mt-3 pr-4">
                  {trailer.moviePoster ? (
                    <img 
                      src={`https://image.tmdb.org/t/p/w92${trailer.moviePoster}`}
                      alt={trailer.movieTitle}
                      className="w-9 h-9 rounded-full object-cover flex-shrink-0 bg-[#272727]"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#272727] flex-shrink-0" />
                  )}
                  <div className="flex flex-col min-w-0">
                    <h3 className="text-[15px] font-semibold text-white line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors">
                      {trailer.name}
                    </h3>
                    <p className="text-[13px] text-[#aaaaaa] mt-1 line-clamp-1 hover:text-white transition-colors">
                      {trailer.movieTitle}
                    </p>
                    <p className="text-[13px] text-[#aaaaaa]">
                      {timeAgo(trailer.published_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Video Modal ── */}
      <AnimatePresence>
        {playingVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-sm"
          >
            {/* Close Background */}
            <div 
              className="absolute inset-0 cursor-pointer" 
              onClick={() => setPlayingVideo(null)}
            />
            
            {/* Modal Content */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-5xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            >
              {/* Close Button */}
              <button 
                onClick={() => setPlayingVideo(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors backdrop-blur-md"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="w-full aspect-video bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${playingVideo.key}?autoplay=1&enablejsapi=1`}
                  title={playingVideo.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
              
              <div className="p-6 bg-[#0a0a0a]">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                  {playingVideo.name}
                </h2>
                <div className="flex items-center gap-4 text-sm text-[#aaaaaa]">
                  <span className="font-semibold text-white">{playingVideo.movieTitle}</span>
                  <span>•</span>
                  <span>{timeAgo(playingVideo.published_at)}</span>
                  <span className="bg-white/10 px-2 py-0.5 rounded text-xs ml-auto font-medium text-white">
                    {playingVideo.type}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
