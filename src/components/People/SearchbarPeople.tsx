import React, { useState } from "react";
import { Person } from "@/types";

interface SearchbarPeopleProps {
  onSearch: (results: Person[]) => void;
}

export default function SearchbarPeople({ onSearch }: SearchbarPeopleProps) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Person[]>([]);
  const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() !== "") {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/person?api_key=${TMDB_API_KEY}&query=${query}`,
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch people: ${response.statusText}`);
        }
        const data = await response.json();
        setSearchResults(data.results);
        onSearch(data.results);
      } catch (error) {
        console.error("Error searching people:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 relative z-20 -mt-20 mb-12">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative flex items-center bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-full p-2 shadow-2xl transition-all duration-300 focus-within:border-blue-500/50 focus-within:bg-gray-900 focus-within:shadow-[0_0_30px_rgba(59,130,246,0.3)]">
          <div className="pl-4 pr-2 text-gray-400">
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            className="w-full bg-transparent border-none outline-none text-white placeholder-gray-500 px-2 py-2 text-base md:text-lg focus:ring-0"
            placeholder="Search for actors, directors, and more..."
            value={query}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-full px-6 py-2.5 transition-all duration-300 transform active:scale-95 disabled:opacity-70 shadow-lg"
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>
    </div>
  );
}
