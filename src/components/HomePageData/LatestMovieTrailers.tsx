import React, { useEffect, useState } from "react";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const LatestMovieTrailers = () => {
  const [trailers, setTrailers] = useState<any[]>([]);
  const [currentTrailer, setCurrentTrailer] = useState<any>(null);
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    const fetchNowPlayingMovies = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/movie/now_playing?api_key=${API_KEY}`,
        );
        const data = await response.json();
        return data.results;
      } catch (error) {
        console.error("Error fetching now playing movies:", error);
        return [];
      }
    };

    const fetchMovieTrailers = async (movieId: number) => {
      try {
        const response = await fetch(
          `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`,
        );
        const data = await response.json();
        return data.results;
      } catch (error) {
        console.error(`Error fetching trailers for movie ${movieId}:`, error);
        return [];
      }
    };

    const getMostRecentTrailer = (trailers: any[]) => {
      return trailers
        .filter((video) => video.type === "Trailer" && video.site === "YouTube")
        .sort(
          (a, b) =>
            new Date(b.published_at).getTime() -
            new Date(a.published_at).getTime(),
        )[0];
    };

    const fetchAndSetTrailers = async () => {
      const movies = await fetchNowPlayingMovies();
      const trailersPromises = movies.map(async (movie: any) => {
        const trailers = await fetchMovieTrailers(movie.id);
        return getMostRecentTrailer(trailers);
      });

      const trailers = await Promise.all(trailersPromises);
      const validTrailers = trailers.filter((trailer) => trailer);
      setTrailers(validTrailers);
      if (validTrailers.length > 0) {
        setCurrentTrailer(validTrailers[0]);
      }
    };

    fetchAndSetTrailers();
  }, []);

  return (
    <div className="bg-gray-950 rounded-3xl overflow-hidden border border-white/5 p-6 shadow-2xl">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Video Player */}
        <div className="w-full lg:w-2/3">
          {currentTrailer ? (
            <div className="w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${currentTrailer.key}?autoplay=1&mute=${userInteracted ? "0" : "1"}&enablejsapi=1`}
                title={currentTrailer.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          ) : (
            <div className="w-full aspect-video rounded-2xl bg-gray-900 animate-pulse border border-white/5" />
          )}
        </div>
        
        {/* Playlist / Sidebar */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4 overflow-y-auto max-h-[510px] pr-2 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
          {trailers.map((trailer) => {
            const isSelected = currentTrailer?.id === trailer.id;
            return (
              <div
                key={trailer.id}
                className={`flex gap-4 p-3 rounded-2xl cursor-pointer transition-all duration-300 ${
                  isSelected 
                    ? "bg-blue-600/10 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]" 
                    : "bg-gray-900/40 border border-white/5 hover:bg-gray-900/80 hover:border-white/10"
                }`}
                onClick={() => {
                  setCurrentTrailer(trailer);
                  setUserInteracted(true);
                }}
              >
                <div className="relative w-32 aspect-video rounded-xl overflow-hidden flex-shrink-0 bg-gray-800">
                  <img
                    src={`https://img.youtube.com/vi/${trailer.key}/0.jpg`}
                    alt={trailer.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Small Play Overlay Icon */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                    <svg className="w-8 h-8 text-white fill-current" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <h4 className={`text-sm font-semibold line-clamp-2 leading-snug ${isSelected ? "text-blue-400" : "text-gray-200"}`}>
                    {trailer.name}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">Official Trailer</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LatestMovieTrailers;
