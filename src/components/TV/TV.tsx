"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
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
  category: string,
  genreId: number | null,
  page: number,
) => {
  try {
    setIsLoading(true);
    const url = genreId
      ? `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&page=${page}&with_genres=${genreId}`
      : `https://api.themoviedb.org/3/tv/${category}?api_key=${API_KEY}&language=en-US&page=${page}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch TV shows: ${response.statusText}`);
    }
    const data = await response.json();
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
  const [tvGenres, setTVGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("popular");
  const [isLoading, setIsLoading] = useState(false);
  const initialFetch = useRef(true);

  useEffect(() => {
    fetchTVGenres(setTVGenres);
  }, []);

  useEffect(() => {
    if (initialFetch.current) {
      fetchTVShows(setTV, setIsLoading, selectedCategory, selectedGenre, page);
      initialFetch.current = false;
    } else {
      fetchTVShows(setTV, setIsLoading, selectedCategory, selectedGenre, page);
    }
  }, [page, selectedGenre, selectedCategory]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSearch = (data: TVShow[]) => {
    setTV(data);
  };

  const handleGenreClick = (genreId: number) => {
    setSelectedGenre(genreId);
    setTV([]);
    setPage(1);
  };

  const handleCategoryChange = (newCategory: string) => {
    setSelectedCategory(newCategory);
    setTV([]);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <br />
      <SearchTVdata Searchdata={handleSearch} />
      <br />
      <FilterTV
        genres={tvGenres}
        selectedGenre={selectedGenre}
        handleGenreClick={handleGenreClick}
      />

      {/* Special Filter Section */}
      <div className="hidden md:block mt-12 mb-8">
        <div className="flex flex-col items-center space-y-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 text-transparent bg-clip-text">
            Discover
          </h2>
          <div className="flex justify-center flex-wrap gap-4 p-2 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800">
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
                  relative px-6 py-2.5 text-base font-medium rounded-xl transition-all duration-300 ease-out
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

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {tv.map((tvShow) => (
            <Link
              href={`/tv/${tvShow.id}`}
              key={tvShow.id}
              className="group relative block h-[380px] w-full bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10 hover:border-gray-700 hover:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="relative h-full w-full">
                {tvShow.poster_path ? (
                  <LazyLoadImage
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`}
                    alt={tvShow.original_name}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-800 text-gray-400 text-sm font-medium">
                    No Image
                  </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  <h3 className="text-lg font-bold text-white leading-tight mb-2 drop-shadow-md transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                    {tvShow.original_name}
                  </h3>

                  <div className="flex items-center space-x-2 text-sm text-gray-300 mb-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                    <span className="text-yellow-400 flex items-center gap-1 font-semibold">
                      <FontAwesomeIcon icon={faStar} className="w-3 h-3" />
                      {tvShow.vote_average.toFixed(1)}
                    </span>
                    <span>•</span>
                    <span>{tvShow.first_air_date?.split("-")[0] || "N/A"}</span>
                  </div>

                  <p className="text-xs text-gray-400 line-clamp-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-150">
                    {tvShow.overview}
                  </p>
                </div>
              </div>
            </Link>
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
