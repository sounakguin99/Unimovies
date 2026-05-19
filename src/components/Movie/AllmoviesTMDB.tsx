"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import GenreFilter from "./FilterMovie";
import SearchMovies from "./Searchbar";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Movie, Genre } from "@/types";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export default function AllmoviesTMDB() {
  const [category, setCategory] = useState("popular");
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const observer = useRef<IntersectionObserver | null>(null);
  const today = new Date().toISOString().split("T")[0];

  // Fetch genres from TMDB API
  const fetchGenres = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}`,
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch genres: ${response.statusText}`);
      }
      const data = await response.json();
      setGenres(data.genres);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  // Fetch movies based on category and genre
  const fetchMovies = async (
    category: string,
    page: number,
    genreId: number | null,
  ) => {
    try {
      setIsLoading(true);
      let url = "";

      if (genreId) {
        let discoverParams = `&sort_by=popularity.desc`;
        if (category === "top_rated") {
          discoverParams = `&sort_by=vote_average.desc&vote_count.gte=300`;
        } else if (category === "upcoming") {
          discoverParams = `&sort_by=popularity.desc&primary_release_date.gte=${today}`;
        } else if (category === "now_playing") {
          const lastMonth = new Date();
          lastMonth.setMonth(lastMonth.getMonth() - 1);
          const lastMonthStr = lastMonth.toISOString().split("T")[0];
          discoverParams = `&sort_by=popularity.desc&primary_release_date.gte=${lastMonthStr}&primary_release_date.lte=${today}`;
        }
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&page=${page}&with_genres=${genreId}${discoverParams}`;
      } else {
        url = `https://api.themoviedb.org/3/movie/${category}?api_key=${TMDB_API_KEY}&page=${page}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch movies: ${response.statusText}`);
      }
      const data = await response.json();
      
      const filteredMovies = genreId ? data.results : data.results.filter(
        (movie: Movie) => category !== "upcoming" || movie.release_date >= today,
      );

      // Remove duplicates based on poster_path
      const removeDuplicatesByPath = (array: Movie[]) => {
        const seen = new Set();
        return array.filter((item: Movie) => {
          const path = item.poster_path;
          if (seen.has(path)) {
            return false;
          }
          seen.add(path);
          return true;
        });
      };

      const uniqueMovies = removeDuplicatesByPath(
        page === 1 ? filteredMovies : [...movies, ...filteredMovies],
      );

      setMovies(uniqueMovies);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setIsLoading(false);
    }
  };

  // Handle search results from SearchMovies component
  const handleSearchResults = (data: Movie[]) => {
    setMovies(data);
  };

  // Handle genre button click
  const handleGenreClick = (genreId: number) => {
    setSelectedGenre(genreId);
    setPage(1);
    setIsLoading(true);
  };

  // Handle category change
  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setPage(1);
    setIsLoading(true);
  };

  // Load more movies when scrolled to the end
  const loadMoreMovies = useCallback(() => {
    if (!isLoading) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isLoading]);

  // Observer for last movie element
  const lastMovieElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadMoreMovies();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, loadMoreMovies],
  );

  // Initial fetch of movies
  useEffect(() => {
    fetchMovies(category, page, selectedGenre);
  }, [category, page, selectedGenre]);

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
              Movies
            </span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl font-medium drop-shadow-md">
            Explore popular movies, top-rated blockbusters, and upcoming
            releases on Unimovies.
          </p>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto">
        <SearchMovies onSearch={handleSearchResults} />

        <GenreFilter
          genres={genres}
          selectedGenre={selectedGenre}
          handleGenreClick={handleGenreClick}
        />

        {/* Special Filter Section */}
        <div className="mt-8 mb-12 px-4">
          <div className="flex flex-col items-center space-y-6">
            <div className="flex justify-center flex-wrap gap-3 md:gap-4 p-2 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800">
              {[
                { id: "popular", label: "Popular" },
                { id: "top_rated", label: "Top Rated" },
                { id: "upcoming", label: "Upcoming" },
                { id: "now_playing", label: "Now Playing" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`
                    relative px-4 md:px-6 py-2.5 text-sm md:text-base font-medium rounded-xl transition-all duration-300 ease-out
                    ${
                      category === cat.id
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.5)] scale-105"
                        : "bg-transparent text-gray-400 hover:text-white hover:bg-white/5"
                    }
                  `}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Movie Grid */}
        <div className="px-4 md:px-8">
          <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4 md:gap-6 lg:gap-8 transition-all duration-300 ${isLoading && page === 1 && movies.length > 0 ? "opacity-40 blur-[2px] pointer-events-none" : "opacity-100 blur-0"}`}>
            {movies.map((movie, index) => (
              <div
                key={movie.id}
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
                            <FontAwesomeIcon
                              icon={faStar}
                              className="w-3 h-3"
                            />
                            {movie.vote_average.toFixed(1)}
                          </span>
                          <span>•</span>
                          <span>
                            {movie.release_date?.split("-")[0] || "N/A"}
                          </span>
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

            {isLoading && (movies.length === 0 || page > 1) &&
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
