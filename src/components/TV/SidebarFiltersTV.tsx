"use client";
import React, { useState } from "react";
import { Genre } from "@/types";

export interface FilterStateTV {
  sortBy: string;
  firstAirDateFrom: string;
  firstAirDateTo: string;
  withGenres: number[];
  withOriginalLanguage: string;
  voteAverageGte: number;
  voteCountGte: number;
  runtimeGte: number;
  runtimeLte: number;
}

interface SidebarFiltersTVProps {
  genres: Genre[];
  onApplyFilters: (filters: FilterStateTV) => void;
}

const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Popularity Descending" },
  { value: "popularity.asc", label: "Popularity Ascending" },
  { value: "vote_average.desc", label: "Rating Descending" },
  { value: "vote_average.asc", label: "Rating Ascending" },
  { value: "first_air_date.desc", label: "First Air Date Descending" },
  { value: "first_air_date.asc", label: "First Air Date Ascending" },
];

const LANGUAGES = [
  { code: "", label: "None Selected" },
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "ja", label: "Japanese" },
  { code: "ko", label: "Korean" },
  { code: "zh", label: "Chinese" },
  { code: "de", label: "German" },
  { code: "it", label: "Italian" },
];

export default function SidebarFiltersTV({ genres, onApplyFilters }: SidebarFiltersTVProps) {
  // Local state for all filters
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [firstAirDateFrom, setFirstAirDateFrom] = useState("");
  const [firstAirDateTo, setFirstAirDateTo] = useState("");
  const [withGenres, setWithGenres] = useState<number[]>([]);
  const [withOriginalLanguage, setWithOriginalLanguage] = useState("");
  const [voteAverageGte, setVoteAverageGte] = useState(0);
  const [voteCountGte, setVoteCountGte] = useState(0);
  const [runtimeGte, setRuntimeGte] = useState(0);
  const [runtimeLte, setRuntimeLte] = useState(400);

  // Accordion open/close states
  const [sortOpen, setSortOpen] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(true);

  const toggleGenre = (id: number) => {
    setWithGenres(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const handleSearch = () => {
    onApplyFilters({
      sortBy,
      firstAirDateFrom,
      firstAirDateTo,
      withGenres,
      withOriginalLanguage,
      voteAverageGte,
      voteCountGte,
      runtimeGte,
      runtimeLte,
    });
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* ── Sort By Section ── */}
      <div className="bg-white text-black rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <button 
          onClick={() => setSortOpen(!sortOpen)}
          className="w-full px-4 py-3 flex items-center justify-between font-semibold text-lg hover:bg-gray-50 transition-colors"
        >
          Sort
          <svg className={`w-5 h-5 transform transition-transform duration-300 ${sortOpen ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
        {sortOpen && (
          <div className="px-4 pb-4 border-t border-gray-100 pt-3">
            <label className="block text-sm text-gray-600 mb-1 font-medium">Sort Results By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-gray-100 text-black px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-blue-400 border border-transparent appearance-none"
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23000000%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right .7rem top 50%', backgroundSize: '.65rem auto' }}
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* ── Filters Section ── */}
      <div className="bg-white text-black rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <button 
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="w-full px-4 py-3 flex items-center justify-between font-semibold text-lg hover:bg-gray-50 transition-colors"
        >
          Filters
          <svg className={`w-5 h-5 transform transition-transform duration-300 ${filtersOpen ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
        
        {filtersOpen && (
          <div className="border-t border-gray-100">
            
            {/* Air Dates */}
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-medium text-gray-700 mb-3">Air Dates</h3>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">from</span>
                  <input 
                    type="date" 
                    value={firstAirDateFrom}
                    onChange={(e) => setFirstAirDateFrom(e.target.value)}
                    className="bg-gray-100 border-none rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-blue-400 text-gray-700" 
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">to</span>
                  <input 
                    type="date" 
                    value={firstAirDateTo}
                    onChange={(e) => setFirstAirDateTo(e.target.value)}
                    className="bg-gray-100 border-none rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-blue-400 text-gray-700" 
                  />
                </div>
              </div>
            </div>

            {/* Genres */}
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-medium text-gray-700 mb-3">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {genres.map(g => (
                  <button
                    key={g.id}
                    onClick={() => toggleGenre(g.id)}
                    className={`px-3 py-1 text-xs border rounded-full transition-colors ${
                      withGenres.includes(g.id)
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300"
                    }`}
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-medium text-gray-700 mb-2">Language</h3>
              <select
                value={withOriginalLanguage}
                onChange={(e) => setWithOriginalLanguage(e.target.value)}
                className="w-full bg-gray-100 text-black px-3 py-2 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23000000%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right .7rem top 50%', backgroundSize: '.65rem auto' }}
              >
                {LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
            </div>

            {/* User Rating */}
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-medium text-gray-700 mb-2">User Score (Min)</h3>
              <div className="flex items-center gap-3">
                <input 
                  type="range" 
                  min="0" 
                  max="10" 
                  step="1"
                  value={voteAverageGte}
                  onChange={(e) => setVoteAverageGte(Number(e.target.value))}
                  className="w-full accent-blue-500" 
                />
                <span className="text-sm font-bold w-4 text-center">{voteAverageGte}</span>
              </div>
            </div>

            {/* Minimum Votes */}
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-medium text-gray-700 mb-2">Minimum User Votes</h3>
              <div className="flex items-center gap-3">
                <input 
                  type="range" 
                  min="0" 
                  max="500" 
                  step="50"
                  value={voteCountGte}
                  onChange={(e) => setVoteCountGte(Number(e.target.value))}
                  className="w-full accent-blue-500" 
                />
                <span className="text-sm font-bold w-8 text-right">{voteCountGte}</span>
              </div>
            </div>

            {/* Runtime */}
            <div className="p-4">
              <h3 className="font-medium text-gray-700 mb-2">Runtime</h3>
              <div className="flex items-center gap-3 text-sm mb-2">
                <span className="w-10 text-gray-500 flex-shrink-0">From</span>
                <input 
                  type="range" 
                  min="0" 
                  max="400" 
                  step="15"
                  value={runtimeGte}
                  onChange={(e) => setRuntimeGte(Number(e.target.value))}
                  className="w-full accent-blue-500" 
                />
                <span className="font-bold w-16 text-right flex-shrink-0 whitespace-nowrap">{runtimeGte} m</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="w-10 text-gray-500 flex-shrink-0">To</span>
                <input 
                  type="range" 
                  min="0" 
                  max="400" 
                  step="15"
                  value={runtimeLte}
                  onChange={(e) => setRuntimeLte(Number(e.target.value))}
                  className="w-full accent-blue-500" 
                />
                <span className="font-bold w-16 text-right flex-shrink-0 whitespace-nowrap">{runtimeLte} m</span>
              </div>
            </div>
            
          </div>
        )}
      </div>

      {/* ── Search Button ── */}
      <button 
        onClick={handleSearch}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-full shadow-lg transition-colors mt-2 text-lg"
      >
        Search
      </button>

    </div>
  );
}
