"use client";
import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faRotateRight,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 bg-black">
      <div className="p-4 bg-red-500/10 rounded-full mb-8">
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          className="text-red-500 text-6xl drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]"
        />
      </div>

      <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent italic">
        Something Went Wrong
      </h1>

      <p className="text-gray-400 max-w-lg mx-auto text-lg mb-10">
        We encountered an unexpected glitch in our transmission. Please try
        reloading the page or go back home.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => reset()}
          className="flex items-center justify-center gap-2 px-8 py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-600/20"
        >
          <FontAwesomeIcon icon={faRotateRight} />
          Try Again
        </button>
        <Link
          href="/"
          className="flex items-center justify-center gap-2 px-8 py-3 bg-gray-900 text-white border border-gray-800 font-semibold rounded-full hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
        >
          <FontAwesomeIcon icon={faHome} />
          Back Home
        </Link>
      </div>

      <div className="mt-12 text-sm text-gray-600">
        Error ID:{" "}
        <span className="font-mono">{error.digest || "unknown glitch"}</span>
      </div>
    </div>
  );
}
