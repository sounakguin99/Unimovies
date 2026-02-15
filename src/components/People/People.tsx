"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import SearchbarPeople from "./SearchbarPeople";
import { Person } from "@/types";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export default function People() {
  const [people, setPeople] = useState<Person[]>([]);
  const [page, setPage] = useState(1);

  const handleData = (data: Person[]) => {
    setPeople(data);
  };

  const fetchPeople = async () => {
    try {
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
    <div className="md:w-3/4 mx-auto">
      <SearchbarPeople onSearch={handleData} />
      <div className="flex flex-wrap justify-center mt-5">
        {people.map((actor) => (
          <div key={actor.id} className="m-2 w-1/2 sm:w-1/3 md:w-1/5 lg:w-1/6">
            <Link href={`/person/${actor.id}`}>
              <img
                src={
                  actor.profile_path
                    ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
                    : "/Images/ok.jpeg"
                }
                alt={actor.name}
                className="w-full h-auto"
              />
            </Link>
            <p className="text-white text-center pt-2">
              {actor.original_name.length > 20
                ? `${actor.original_name.slice(0, 20)}...`
                : actor.original_name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
