import React from "react";
import { Genre } from "@/types";

interface FilterMovieProps {
  genres: Genre[];
  selectedGenre: number | null;
  handleGenreClick: (genreId: number) => void;
}

const FilterMovie = ({
  genres,
  selectedGenre,
  handleGenreClick,
}: FilterMovieProps) => {
  if (!genres || genres.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mb-8">
      {/* Scrollable Container for Genres */}
      <div className="flex overflow-x-auto hide-scrollbar gap-3 pb-4 pt-2 px-2 snap-x">
        <button
          onClick={() => handleGenreClick(0)} // Pass 0 or null for "All"
          className={`
            snap-start whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300
            ${
              selectedGenre === null || selectedGenre === 0
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30 scale-105"
                : "bg-gray-900/80 text-gray-400 hover:bg-gray-800 hover:text-white border border-gray-800"
            }
          `}
        >
          All Genres
        </button>
        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => handleGenreClick(genre.id)}
            className={`
              snap-start whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300
              ${
                selectedGenre === genre.id
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30 scale-105"
                  : "bg-gray-900/80 text-gray-400 hover:bg-gray-800 hover:text-white border border-gray-800"
              }
            `}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterMovie;
