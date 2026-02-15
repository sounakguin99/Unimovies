"use client";

import React from "react";

export default function OfflinePage() {
  const handleRetry = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Animated icon */}
        <div className="relative mx-auto w-32 h-32">
          {/* Pulsing ring */}
          <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 animate-ping" />
          <div className="absolute inset-2 rounded-full border-2 border-purple-500/20 animate-pulse" />

          {/* Icon container */}
          <div className="relative flex items-center justify-center w-full h-full rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-gray-800">
            <svg
              className="w-16 h-16 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12 18.75h.008v.008H12v-.008z"
              />
              {/* X mark over wifi icon */}
              <line
                x1="4"
                y1="4"
                x2="20"
                y2="20"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                className="text-red-400"
              />
            </svg>
          </div>
        </div>

        {/* Text content */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            You&apos;re Offline
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            It looks like you&apos;ve lost your internet connection. Check your
            network settings and try again.
          </p>
        </div>

        {/* Status card */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Connection Status</span>
            <span className="flex items-center gap-2 text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              Disconnected
            </span>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
          <p className="text-gray-500 text-sm">
            Previously cached pages may still be available. Your data will sync
            automatically when you reconnect.
          </p>
        </div>

        {/* Retry button */}
        <button
          onClick={handleRetry}
          className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-lg font-semibold text-white rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]"
        >
          {/* Button glow */}
          <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
          <svg
            className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"
            />
          </svg>
          Try Again
        </button>

        {/* Brand */}
        <p className="text-gray-600 text-sm">
          <span className="font-bold bg-gradient-to-r from-blue-400/60 to-purple-500/60 text-transparent bg-clip-text">
            UNIMOVIES
          </span>{" "}
          — Your Ultimate Movie Destination
        </p>
      </div>
    </div>
  );
}
