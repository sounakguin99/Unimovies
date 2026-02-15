"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import SearchbarPeople from "./SearchbarPeople";
import { Person } from "@/types";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export default function People() {
  const [people, setPeople] = useState<Person[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleData = (data: Person[]) => {
    setPeople(data);
  };

  const fetchPeople = async () => {
    try {
      setIsLoading(true);
      const endpoint = `https://api.themoviedb.org/3/person/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`;

      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Failed to fetch people: ${response.statusText}`);
      }
      const data = await response.json();

      if (page === 1) {
        setPeople(data.results);
      } else {
        setPeople((prevPeople) => [...prevPeople, ...data.results]);
      }
    } catch (error) {
      console.error("Error fetching people:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPeople();
  }, [page]);

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

  return (
    <div className="w-full px-4 md:px-8 py-8 bg-black min-h-screen">
      <SearchbarPeople onSearch={handleData} />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mt-8">
        {people.map((actor) => (
          <div
            key={actor.id}
            className="group relative bg-gray-900 rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gray-800"
          >
            <Link href={`/people/${actor.id}`}>
              <div className="aspect-[2/3] w-full overflow-hidden">
                <img
                  src={
                    actor.profile_path
                      ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
                      : "/Images/ok.jpeg"
                  }
                  alt={actor.name}
                  className="w-full h-full object-cover transition-opacity duration-300 hover:opacity-90"
                />
              </div>
            </Link>
            <div className="p-3 text-center">
              <p className="text-white font-medium text-sm md:text-base truncate">
                {actor.original_name}
              </p>
            </div>
          </div>
        ))}
        {isLoading &&
          [...Array(12)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-900 rounded-xl overflow-hidden shadow-lg"
            >
              <Skeleton
                className="aspect-[2/3] w-full"
                baseColor="#202020"
                highlightColor="#444"
              />
              <div className="p-3">
                <Skeleton
                  height={20}
                  width="80%"
                  className="mx-auto"
                  baseColor="#202020"
                  highlightColor="#444"
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
