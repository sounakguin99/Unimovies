"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
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
      const url = genreId
        ? `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&sort_by=popularity.desc&page=${page}&with_genres=${genreId}`
        : `https://api.themoviedb.org/3/movie/${category}?api_key=${TMDB_API_KEY}&page=${page}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch movies: ${response.statusText}`);
      }
      const data = await response.json();
      const filteredMovies = data.results.filter(
        (movie: Movie) =>
          category !== "upcoming" || movie.release_date >= today,
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
    setMovies([]);
    setPage(1);
    fetchMovies(category, 1, genreId);
  };

  // Handle category change
  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setMovies([]);
    setPage(1);
    fetchMovies(newCategory, 1, selectedGenre);
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
    <div className="min-h-screen bg-black text-white">
      <br />
      <SearchMovies onSearch={handleSearchResults} />
      <GenreFilter
        genres={genres}
        selectedGenre={selectedGenre}
        handleGenreClick={handleGenreClick}
      />

      {/* Special Filter Section */}
      <div className="hidden md:block mt-12 mb-8">
        <div className="flex flex-col items-center space-y-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 text-transparent bg-clip-text">
            Explore Movies
          </h2>
          <div className="flex justify-center flex-wrap gap-4 p-2 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800">
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
                  relative px-6 py-2.5 text-base font-medium rounded-xl transition-all duration-300 ease-out
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

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {movies.map((movie, index) => (
            <div
              key={movie.id}
              ref={index === movies.length - 1 ? lastMovieElementRef : null}
              className="h-full"
            >
              <Link
                href={`/movie/${movie.id}`}
                className="group relative block h-[380px] w-full bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10 hover:border-gray-700 hover:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <div className="relative h-full w-full">
                  {movie.poster_path ? (
                    <LazyLoadImage
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.original_title}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-800 text-gray-400 text-sm font-medium">
                      No Image
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                    <h3 className="text-lg font-bold text-white leading-tight mb-2 drop-shadow-md transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                      {movie.original_title}
                    </h3>

                    <div className="flex items-center space-x-2 text-sm text-gray-300 mb-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                      <span className="text-yellow-400 flex items-center gap-1 font-semibold">
                        <FontAwesomeIcon icon={faStar} className="w-3 h-3" />
                        {movie.vote_average.toFixed(1)}
                      </span>
                      <span>•</span>
                      <span>{movie.release_date?.split("-")[0] || "N/A"}</span>
                    </div>

                    <p className="text-xs text-gray-400 line-clamp-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-150">
                      {movie.overview}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}

          {isLoading &&
            [...Array(10)].map((_, i) => (
              <div
                key={i}
                className="h-[380px] rounded-2xl overflow-hidden bg-gray-900 border border-gray-800"
              >
                <Skeleton
                  height="100%"
                  baseColor="#1f2937"
                  highlightColor="#374151"
                  className="h-full w-full"
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
