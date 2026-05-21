"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import SearchTVdata from "./SearchTVdata";
import SidebarFiltersTV, { FilterStateTV } from "./SidebarFiltersTV";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { TVShow, Genre } from "@/types";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export default function TV() {
  const [tv, setTV] = useState<TVShow[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tvGenres, setTVGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const [filters, setFilters] = useState<FilterStateTV>({
    sortBy: "popularity.desc",
    firstAirDateFrom: "",
    firstAirDateTo: "",
    withGenres: [],
    withOriginalLanguage: "",
    voteAverageGte: 0,
    voteCountGte: 0,
    runtimeGte: 0,
    runtimeLte: 400,
  });

  const fetchTVGenres = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}&language=en-US`,
      );
      if (!response.ok) throw new Error("Failed to fetch TV genres");
      const data = await response.json();
      setTVGenres(data.genres);
    } catch (error) {
      console.error("Error fetching TV genres:", error);
    }
  };

  useEffect(() => {
    fetchTVGenres();
  }, []);

  const fetchTVShows = useCallback(async (currentFilters: FilterStateTV, currentPage: number) => {
    try {
      setIsLoading(true);

      const params = new URLSearchParams({
        api_key: API_KEY || "",
        page: currentPage.toString(),
        sort_by: currentFilters.sortBy,
        "vote_average.gte": currentFilters.voteAverageGte.toString(),
        "vote_count.gte": currentFilters.voteCountGte.toString(),
        "with_runtime.gte": currentFilters.runtimeGte.toString(),
        "with_runtime.lte": currentFilters.runtimeLte.toString(),
      });

      if (currentFilters.firstAirDateFrom) {
        params.append("first_air_date.gte", currentFilters.firstAirDateFrom);
      }
      if (currentFilters.firstAirDateTo) {
        params.append("first_air_date.lte", currentFilters.firstAirDateTo);
      }
      if (currentFilters.withGenres.length > 0) {
        params.append("with_genres", currentFilters.withGenres.join(","));
      }
      if (currentFilters.withOriginalLanguage) {
        params.append("with_original_language", currentFilters.withOriginalLanguage);
      }

      const url = `https://api.themoviedb.org/3/discover/tv?${params.toString()}`;
      const response = await fetch(url);
      
      if (!response.ok) throw new Error(`Failed to fetch TV shows: ${response.statusText}`);
      
      const data = await response.json();
      setTotalPages(data.total_pages || 1);

      // Remove duplicates
      const removeDuplicates = (array: TVShow[]) => {
        const seen = new Set();
        return array.filter((item) => {
          if (!item.poster_path) return true;
          if (seen.has(item.poster_path)) return false;
          seen.add(item.poster_path);
          return true;
        });
      };

      setTV(prev => {
        if (currentPage === 1) return removeDuplicates(data.results);
        return removeDuplicates([...prev, ...data.results]);
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching TV shows:", error);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTVShows(filters, page);
  }, [filters, page, fetchTVShows]);

  const handleSearch = (data: TVShow[]) => {
    setTV(data);
    setPage(1);
    setTotalPages(1);
  };

  const handleApplyFilters = (newFilters: FilterStateTV) => {
    setFilters(newFilters);
    setPage(1);
  };

  const loadMoreTV = useCallback(() => {
    if (!isLoading && page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isLoading, page, totalPages]);

  const lastTVElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      if (page >= totalPages) return;

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && window.innerWidth < 1024) {
          loadMoreTV();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, loadMoreTV, page, totalPages],
  );

  return (
    <div className="w-full bg-[#0a0a0a] min-h-screen pb-16">
      {/* Cinematic Hero Header */}
      <div className="relative w-full h-[30vh] md:h-[40vh] flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[url('/Images/ok.jpeg')] bg-cover bg-center opacity-30 filter blur-md transform scale-105"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/80 to-transparent"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-10">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-3 drop-shadow-2xl">
            Popular <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">TV Series</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-lg font-medium drop-shadow-md">
            Discover thousands of TV shows with advanced filtering
          </p>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-8">
        
        {/* Centered Search Bar */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-2xl">
            <SearchTVdata Searchdata={handleSearch} />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Sidebar Filters */}
          <div className="w-full lg:w-[320px] flex-shrink-0">
            <div className="sticky top-[80px]">
              <SidebarFiltersTV genres={tvGenres} onApplyFilters={handleApplyFilters} />
            </div>
          </div>

          {/* Right Main Content */}
          <div className="flex-1 min-w-0">

            {/* TV Grid */}
            <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 transition-all duration-300 ${isLoading && page === 1 && tv.length > 0 ? "opacity-50 blur-[2px] pointer-events-none" : "opacity-100 blur-0"}`}>
              {tv.map((tvShow, index) => (
                <div
                  key={`${tvShow.id}-${index}`}
                  ref={index === tv.length - 1 ? lastTVElementRef : undefined}
                  className="group relative rounded-2xl overflow-hidden shadow-2xl bg-gray-900 border border-white/5 cursor-pointer aspect-[2/3] transition-all duration-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:-translate-y-2"
                >
                  <Link href={`/tv/${tvShow.id}`}>
                    <div className="relative w-full h-full">
                      {tvShow.poster_path ? (
                        <Image
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                          src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`}
                          alt={tvShow.original_name || "TV poster"}
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500 text-center p-4">
                          No Poster Available
                        </div>
                      )}

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Hover Glow Effect */}
                      <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay"></div>

                      {/* Text Content */}
                      <div className="absolute bottom-0 inset-x-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        <h3 className="text-white font-bold text-base line-clamp-1 drop-shadow-md mb-2">
                          {tvShow.name || tvShow.original_name}
                        </h3>

                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center space-x-2 text-xs text-gray-300">
                            <span className="text-yellow-400 flex items-center gap-1 font-semibold">
                              <FontAwesomeIcon icon={faStar} className="w-3 h-3" />
                              {tvShow.vote_average?.toFixed(1) || "NR"}
                            </span>
                            <span>•</span>
                            <span>
                              {tvShow.first_air_date?.split("-")[0] || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}

              {/* Skeletons for Loading State */}
              {isLoading && tv.length === 0 &&
                [...Array(15)].map((_, i) => (
                  <div key={`skeleton-${i}`} className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-900 border border-white/5 aspect-[2/3]">
                    <Skeleton height="100%" baseColor="#1a1a1a" highlightColor="#2a2a2a" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} />
                    <div className="absolute bottom-0 inset-x-0 p-4 z-10 bg-gradient-to-t from-black/90 to-transparent">
                      <Skeleton width="80%" height={20} baseColor="#222" highlightColor="#333" className="mb-2" />
                      <Skeleton width="50%" height={12} baseColor="#222" highlightColor="#333" />
                    </div>
                  </div>
                ))}
            </div>

            {/* Loading Spinner for Infinite Scroll (Mobile) */}
            {isLoading && page > 1 && (
              <div className="flex justify-center items-center py-12 mt-4 w-full">
                <div className="flex items-center space-x-3 bg-gray-900/80 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-2xl">
                  <div className="w-5 h-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
                  <span className="text-gray-300 text-sm font-semibold tracking-wide">Loading more TV shows...</span>
                </div>
              </div>
            )}

            {/* Load More Button (Desktop Only) */}
            {!isLoading && page < totalPages && tv.length > 0 && (
              <div className="hidden lg:flex justify-center mt-12 mb-8">
                <button 
                  onClick={loadMoreTV}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]"
                >
                  Load More
                </button>
              </div>
            )}
            
            {/* Empty State */}
            {!isLoading && tv.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 bg-gray-900/30 rounded-2xl border border-white/5 mt-8">
                <span className="text-5xl mb-4">📺</span>
                <h2 className="text-2xl font-bold text-white mb-2">No TV shows found</h2>
                <p className="text-gray-400">Try adjusting your filters to find what you're looking for.</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
