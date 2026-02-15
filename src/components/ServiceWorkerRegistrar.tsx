"use client";

import { useEffect } from "react";

/**
 * Component that registers the service worker on mount.
 * This replaces next-pwa's auto-registration, giving us full control
 * over when and how the SW is registered.
 */
export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      // Register after page load for better initial performance
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js", { scope: "/" })
          .then((registration) => {
            console.log(
              "[PWA] Service Worker registered with scope:",
              registration.scope,
            );

            // Check for updates periodically (every 60 minutes)
            setInterval(
              () => {
                registration.update();
                console.log("[PWA] Checking for SW updates...");
              },
              60 * 60 * 1000,
            );
          })
          .catch((error) => {
            console.error("[PWA] Service Worker registration failed:", error);
          });
      });
    }
  }, []);

  return null;
}
