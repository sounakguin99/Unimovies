"use client";

import React from "react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

/**
 * A thin banner that appears when the user goes offline.
 * Automatically hides when connection is restored.
 */
export default function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[10000] flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 px-4 py-2.5 text-white text-sm font-medium shadow-lg">
      <svg
        className="w-4 h-4 animate-pulse"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      </svg>
      <span>You&apos;re offline — some features may be unavailable</span>
    </div>
  );
}
