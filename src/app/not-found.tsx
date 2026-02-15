"use client";
import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faFilm } from "@fortawesome/free-solid-svg-icons";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 bg-black">
      <div className="relative">
        <h1 className="text-9xl font-extrabold text-white opacity-20 select-none">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent text-4xl md:text-6xl font-bold">
            Lost in Space
          </div>
        </div>
      </div>

      <p className="mt-8 text-gray-400 max-w-md mx-auto text-lg">
        The movie you're looking for was either deleted from our database or
        never existed in this cinematic universe.
      </p>

      <div className="mt-12 flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300 transform hover:scale-105"
        >
          <FontAwesomeIcon icon={faHome} />
          Back to Home
        </Link>
        <Link
          href="/movies"
          className="flex items-center justify-center gap-2 px-8 py-3 bg-gray-900 text-white border border-gray-800 font-semibold rounded-full hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
        >
          <FontAwesomeIcon icon={faFilm} />
          Browse Movies
        </Link>
      </div>

      <div className="mt-16 animate-bounce">
        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mx-auto shadow-[0_0_10px_#3b82f6]"></div>
      </div>
    </div>
  );
}
