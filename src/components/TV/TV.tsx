"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import SearchTVdata from "./SearchTVdata";
import FilterTV from "./FilterTV";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { TVShow, Genre } from "@/types";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

// Fetch TV genres from TMDB API
const fetchTVGenres = async (
  setTVGenres: React.Dispatch<React.SetStateAction<Genre[]>>,
) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}&language=en-US`,
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch TV genres: ${response.statusText}`);
    }
    const data = await response.json();
    setTVGenres(data.genres);
  } catch (error) {
    console.error("Error fetching TV genres:", error);
  }
};

// Fetch TV shows based on category, genre, and page
const fetchTVShows = async (
  setTV: React.Dispatch<React.SetStateAction<TVShow[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setTotalPages: React.Dispatch<React.SetStateAction<number>>,
  category: string,
  genreId: number | null,
  page: number,
) => {
  try {
    setIsLoading(true);
    let url = "";
    if (genreId) {
      let discoverParams = `&sort_by=popularity.desc`;
      const today = new Date().toISOString().split("T")[0];
      
      if (category === "top_rated") {
        discoverParams = `&sort_by=vote_average.desc&vote_count.gte=300`;
      } else if (category === "airing_today") {
        discoverParams = `&sort_by=popularity.desc&air_date.lte=${today}&air_date.gte=${today}`;
      } else if (category === "on_the_air") {
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        const nextWeekStr = nextWeek.toISOString().split("T")[0];
        discoverParams = `&sort_by=popularity.desc&air_date.gte=${today}&air_date.lte=${nextWeekStr}`;
      }
      url = `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=en-US&page=${page}&with_genres=${genreId}${discoverParams}`;
    } else {
      url = `https://api.themoviedb.org/3/tv/${category}?api_key=${API_KEY}&language=en-US&page=${page}`;
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch TV shows: ${response.statusText}`);
    }
    const data = await response.json();
    setTotalPages(data.total_pages || 1);
    setTV((prevTV) =>
      page === 1 ? data.results : [...prevTV, ...data.results],
    );
    setIsLoading(false);
  } catch (error) {
    console.error("Error fetching TV shows:", error);
    setIsLoading(false);
  }
};

export default function TV() {
  const [tv, setTV] = useState<TVShow[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tvGenres, setTVGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("popular");
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    fetchTVGenres(setTVGenres);
  }, []);

  useEffect(() => {
    fetchTVShows(setTV, setIsLoading, setTotalPages, selectedCategory, selectedGenre, page);
  }, [page, selectedGenre, selectedCategory]);

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
        if (entries[0].isIntersecting) {
          loadMoreTV();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, loadMoreTV, page, totalPages],
  );

  const handleSearch = (data: TVShow[]) => {
    setTV(data);
    setPage(1);
    setTotalPages(1);
  };

  const handleGenreClick = (genreId: number) => {
    setSelectedGenre(genreId);
    setPage(1);
    setTotalPages(1);
    setIsLoading(true);
  };

  const handleCategoryChange = (newCategory: string) => {
    setSelectedCategory(newCategory);
    setPage(1);
    setTotalPages(1);
    setIsLoading(true);
  };

  return (
    <div className="w-full bg-black min-h-screen pb-16">
      {/* Cinematic Hero Header */}
      <div className="relative w-full h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[url('/Images/ok.jpeg')] bg-cover bg-center opacity-30 filter blur-sm transform scale-105"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-16">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-4 drop-shadow-2xl">
            Browse{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              TV Shows
            </span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl font-medium drop-shadow-md">
            Explore popular series, top-rated dramas, and trending comedies on
            Unimovies.
          </p>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto">
        <SearchTVdata Searchdata={handleSearch} />

        <FilterTV
          genres={tvGenres}
          selectedGenre={selectedGenre}
          handleGenreClick={handleGenreClick}
        />

        {/* Special Filter Section */}
        <div className="mt-8 mb-12 px-4">
          <div className="flex flex-col items-center space-y-6">
            <div className="flex justify-center flex-wrap gap-3 md:gap-4 p-2 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800">
              {[
                { id: "popular", label: "Popular" },
                { id: "airing_today", label: "Airing Today" },
                { id: "on_the_air", label: "On TV" },
                { id: "top_rated", label: "Top Rated" },
              ].map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`
                    relative px-4 md:px-6 py-2.5 text-sm md:text-base font-medium rounded-xl transition-all duration-300 ease-out
                    ${
                      selectedCategory === category.id
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.5)] scale-105"
                        : "bg-transparent text-gray-400 hover:text-white hover:bg-white/5"
                    }
                  `}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* TV Grid */}
        <div className="px-4 md:px-8">
          <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4 md:gap-6 lg:gap-8 transition-all duration-300 ${isLoading && page === 1 && tv.length > 0 ? "opacity-40 blur-[2px] pointer-events-none" : "opacity-100 blur-0"}`}>
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
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                        src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`}
                        alt={tvShow.original_name}
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <img
                        src="/Images/ok.jpeg"
                        alt={tvShow.original_name}
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
                        {tvShow.original_name}
                      </h3>

                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-300">
                          <span className="text-yellow-400 flex items-center gap-1 font-semibold">
                            <FontAwesomeIcon
                              icon={faStar}
                              className="w-3 h-3"
                            />
                            {tvShow.vote_average.toFixed(1)}
                          </span>
                          <span>•</span>
                          <span>
                            {tvShow.first_air_date?.split("-")[0] || "N/A"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 line-clamp-2">
                          {tvShow.overview}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}

            {isLoading && (tv.length === 0 || page > 1) &&
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
                    <Skeleton
                      width="80%"
                      height={24}
                      baseColor="#222"
                      highlightColor="#333"
                      className="mb-2"
                    />
                    <Skeleton
                      width="50%"
                      height={16}
                      baseColor="#222"
                      highlightColor="#333"
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
