"use client";

import React, { useState } from "react";
import { useServiceWorker } from "@/hooks/useServiceWorker";

/**
 * Shows a toast notification when a new version of the app is available.
 * Users can click to reload and get the latest version.
 */
export default function PWAUpdateNotification() {
  const { updateAvailable, registration } = useServiceWorker();
  const [dismissed, setDismissed] = useState(false);

  const handleUpdate = () => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
    }
    window.location.reload();
  };

  if (!updateAvailable || dismissed) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[9999] animate-in slide-in-from-bottom-4">
      <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl shadow-black/50 p-5 max-w-[340px]">
        {/* Gradient accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-t-2xl" />

        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
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
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm mb-1">
              Update Available
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              A newer version of Unimovies is available with improvements and
              bug fixes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={() => setDismissed(true)}
            className="flex-1 py-2 px-4 text-sm font-medium text-gray-400 hover:text-white rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-200"
          >
            Later
          </button>
          <button
            onClick={handleUpdate}
            className="flex-1 py-2 px-4 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 transition-all duration-200 shadow-lg shadow-green-500/20"
          >
            Update Now
          </button>
        </div>
      </div>
    </div>
  );
}
