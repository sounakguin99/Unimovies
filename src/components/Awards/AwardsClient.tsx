"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faTrophy, faAward, faFilm, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { Movie } from "@/types";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export default function AwardsClient() {
  const [activeTab, setActiveTab] = useState("oscars");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const observer = useRef<IntersectionObserver | null>(null);

  const awardTabs = [
    {
      id: "oscars",
      label: "Academy Awards",
      sublabel: "Best Picture Winners",
      icon: faTrophy,
      color: "from-amber-500 to-yellow-400",
      shadow: "shadow-amber-500/30",
    },
    {
      id: "animation",
      label: "Animated Features",
      sublabel: "Acclaimed Masterpieces",
      icon: faFilm,
      color: "from-blue-600 to-indigo-500",
      shadow: "shadow-blue-500/30",
    },
    {
      id: "cannes",
      label: "Cannes Film Festival",
      sublabel: "Palme d'Or & Contenders",
      icon: faAward,
      color: "from-purple-600 to-pink-500",
      shadow: "shadow-purple-500/30",
    },
    {
      id: "golden_globes",
      label: "Golden Globes",
      sublabel: "Best Motion Picture",
      icon: faGlobe,
      color: "from-emerald-600 to-teal-500",
      shadow: "shadow-emerald-500/30",
    },
  ];

  const fetchAwardMovies = useCallback(async (tab: string, currentPage: number) => {
    try {
      setIsLoading(true);
      let url = "";

      if (tab === "oscars") {
        // High vote count and high rating representing Oscar-calibre films
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&sort_by=popularity.desc&vote_count.gte=3000&vote_average.gte=7.8&page=${currentPage}`;
      } else if (tab === "animation") {
        // Highest rated animated features with 1000+ votes
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=16&sort_by=vote_average.desc&vote_count.gte=1000&page=${currentPage}`;
      } else if (tab === "cannes") {
        // Acclaimed international cinema (French, Italian, Japanese, Korean, Spanish, German)
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&sort_by=popularity.desc&vote_count.gte=500&vote_average.gte=7.5&with_original_language=fr|it|ja|ko|es|de&page=${currentPage}`;
      } else if (tab === "golden_globes") {
        // Acclaimed movies with high vote count & rating representing Golden Globe winners/nominees
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&sort_by=popularity.desc&vote_count.gte=1500&vote_average.gte=7.4&page=${currentPage}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch award movies: ${response.statusText}`);
      }
      const data = await response.json();
      setTotalPages(data.total_pages || 1);

      // Remove duplicates based on poster_path
      const removeDuplicatesByPath = (array: Movie[]) => {
        const seen = new Set();
        return array.filter((item: Movie) => {
          const path = item.poster_path;
          if (seen.has(path)) return false;
          seen.add(path);
          return true;
        });
      };

      setMovies((prevMovies) => {
        const combined = currentPage === 1 ? data.results : [...prevMovies, ...data.results];
        return removeDuplicatesByPath(combined);
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching award movies:", error);
      setIsLoading(false);
    }
  }, []);

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setPage(1);
    setTotalPages(1);
    setIsLoading(true);
  };

  // Pagination / Infinite Scroll
  const loadMoreMovies = useCallback(() => {
    if (!isLoading && page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isLoading, page, totalPages]);

  const lastMovieElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      if (page >= totalPages) return;

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadMoreMovies();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, loadMoreMovies, page, totalPages],
  );

  useEffect(() => {
    fetchAwardMovies(activeTab, page);
  }, [activeTab, page, fetchAwardMovies]);

  const currentTabData = awardTabs.find((t) => t.id === activeTab);

  return (
    <div className="w-full bg-black min-h-screen pb-16">
      {/* Cinematic Hero Header */}
      <div className="relative w-full h-[45vh] md:h-[55vh] flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[url('/Images/ok.jpeg')] bg-cover bg-center opacity-30 filter blur-sm transform scale-105"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
        
        {/* Glow orb matching active tab */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r ${currentTabData?.color} opacity-20 blur-[120px] rounded-full pointer-events-none transition-all duration-700`}></div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-16 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 shadow-2xl animate-fade-in">
            <FontAwesomeIcon icon={faTrophy} className="text-amber-400 w-4 h-4 animate-bounce" />
            <span className="text-xs md:text-sm font-bold tracking-widest text-amber-400 uppercase">
              Prestigious Cinema Honors
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-4 drop-shadow-2xl">
            Award-Winning{" "}
            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${currentTabData?.color}`}>
              Masterpieces
            </span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl font-medium drop-shadow-md max-w-2xl mx-auto mb-8">
            Explore cinematic achievements across the Academy Awards, Cannes Palme d'Or, Golden Globes, and Animation honors.
          </p>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 -mt-8 relative z-20 mb-12">
        {/* Glassmorphism Tab Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-3 bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
          {awardTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 text-left group ${
                  isActive
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg ${tab.shadow} scale-[1.02]`
                    : "bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5"
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
                  isActive ? "bg-black/20 text-white" : "bg-black/40 text-gray-300"
                }`}>
                  <FontAwesomeIcon icon={tab.icon} className="w-6 h-6" />
                </div>
                <div>
                  <div className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${isActive ? "text-white/80" : "text-gray-500"}`}>
                    {tab.sublabel}
                  </div>
                  <div className={`text-base font-black tracking-tight ${isActive ? "text-white" : "text-gray-200"}`}>
                    {tab.label}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Movie Grid */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4 md:gap-6 lg:gap-8 transition-all duration-300 ${isLoading && page === 1 && movies.length > 0 ? "opacity-40 blur-[2px] pointer-events-none" : "opacity-100 blur-0"}`}>
          {movies.map((movie, index) => (
            <div
              key={`${movie.id}-${index}`}
              ref={index === movies.length - 1 ? lastMovieElementRef : null}
              className="group relative rounded-2xl overflow-hidden shadow-2xl bg-gray-900 border border-white/5 cursor-pointer aspect-[2/3] transition-all duration-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:-translate-y-2"
            >
              <Link href={`/movie/${movie.id}`}>
                <div className="relative w-full h-full">
                  {movie.poster_path ? (
                    <Image
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.original_title}
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <img
                      src="/Images/ok.jpeg"
                      alt={movie.original_title}
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay"></div>

                  {/* Text Content */}
                  <div className="absolute bottom-0 inset-x-0 p-4 md:p-5 flex flex-col justify-end opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <h3 className="text-white font-bold text-lg md:text-xl line-clamp-1 drop-shadow-md mb-2">
                      {movie.original_title}
                    </h3>

                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-300">
                        <span className="text-yellow-400 flex items-center gap-1 font-semibold">
                          <FontAwesomeIcon icon={faStar} className="w-3 h-3" />
                          {movie.vote_average.toFixed(1)}
                        </span>
                        <span>•</span>
                        <span>{movie.release_date?.split("-")[0] || "N/A"}</span>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2">
                        {movie.overview}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}

          {isLoading && movies.length === 0 &&
            [...Array(14)].map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-900 border border-white/5 aspect-[2/3]"
              >
                <Skeleton
                  height="100%"
                  baseColor="#111"
                  highlightColor="#222"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                  }}
                />
                <div className="absolute bottom-0 inset-x-0 p-4 md:p-5 z-10 bg-gradient-to-t from-black/90 to-transparent">
                  <Skeleton width="80%" height={24} baseColor="#222" highlightColor="#333" className="mb-2" />
                  <Skeleton width="50%" height={16} baseColor="#222" highlightColor="#333" />
                </div>
              </div>
            ))}
        </div>

        {/* Loading Spinner for Infinite Scroll */}
        {isLoading && page > 1 && (
          <div className="flex justify-center items-center py-12 mt-4 w-full">
            <div className="flex items-center space-x-3 bg-gray-900/80 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-2xl">
              <div className="w-5 h-5 rounded-full border-2 border-amber-500 border-t-transparent animate-spin"></div>
              <span className="text-gray-300 text-sm font-semibold tracking-wide">Loading more masterpieces...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
