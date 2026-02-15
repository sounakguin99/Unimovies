/// <reference lib="webworker" />

/**
 * Unimovies Service Worker
 * 
 * Manual service worker using Workbox strategies for:
 * - Offline support with fallback page
 * - Cache-first for static assets and images
 * - Stale-while-revalidate for API responses
 * - Network-first for page navigation
 */

const CACHE_VERSION = "v1";
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;
const IMAGE_CACHE = `images-${CACHE_VERSION}`;
const API_CACHE = `api-${CACHE_VERSION}`;
const FONT_CACHE = `fonts-${CACHE_VERSION}`;

// Assets to precache on install
const PRECACHE_ASSETS = [
  "/",
  "/offline",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

// Maximum cache entries
const MAX_ENTRIES = {
  images: 500,
  api: 200,
  dynamic: 50,
  fonts: 30,
};

// ========================================
// Install Event
// ========================================
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("[SW] Precaching static assets");
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        // @ts-expect-error - skipWaiting is valid on ServiceWorkerGlobalScope
        return self.skipWaiting();
      })
  );
});

// ========================================
// Activate Event
// ========================================
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => {
              // Delete old caches from previous versions
              return (
                name.startsWith("static-") ||
                name.startsWith("dynamic-") ||
                name.startsWith("images-") ||
                name.startsWith("api-") ||
                name.startsWith("fonts-")
              ) && !name.endsWith(CACHE_VERSION);
            })
            .map((name) => {
              console.log("[SW] Deleting old cache:", name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        // @ts-expect-error - clients is valid on ServiceWorkerGlobalScope
        return self.clients.claim();
      })
  );
});

// ========================================
// Fetch Event - Routing & Caching Strategies
// ========================================
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Skip Chrome extension requests
  if (url.protocol === "chrome-extension:") return;

  // Skip Next.js HMR & internal dev requests
  if (url.pathname.startsWith("/_next/webpack-hmr")) return;

  // Route to appropriate strategy
  if (isApiRequest(url)) {
    event.respondWith(staleWhileRevalidate(request, API_CACHE, MAX_ENTRIES.api));
  } else if (isTMDBImage(url)) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE, MAX_ENTRIES.images, 60 * 60 * 24 * 7));
  } else if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE, MAX_ENTRIES.dynamic, 60 * 60 * 24 * 30));
  } else if (isFontRequest(url)) {
    event.respondWith(cacheFirst(request, FONT_CACHE, MAX_ENTRIES.fonts, 60 * 60 * 24 * 365));
  } else if (isLocalImage(url)) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE, MAX_ENTRIES.images, 60 * 60 * 24 * 30));
  } else if (isNavigationRequest(request)) {
    event.respondWith(networkFirstWithOfflineFallback(request));
  } else {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
  }
});

// ========================================
// URL Matchers
// ========================================
function isApiRequest(url) {
  return url.hostname === "api.themoviedb.org";
}

function isTMDBImage(url) {
  return url.hostname === "image.tmdb.org";
}

function isStaticAsset(url) {
  return /\.(?:js|css)$/i.test(url.pathname);
}

function isFontRequest(url) {
  return (
    url.hostname === "fonts.googleapis.com" ||
    url.hostname === "fonts.gstatic.com" ||
    /\.(?:woff|woff2|ttf|otf|eot)$/i.test(url.pathname)
  );
}

function isLocalImage(url) {
  return /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i.test(url.pathname);
}

function isNavigationRequest(request) {
  return request.mode === "navigate";
}

// ========================================
// Caching Strategies
// ========================================

/**
 * Cache-First Strategy
 * Returns cached response if available, otherwise fetches from network and caches.
 * Best for: static assets, images, fonts
 */
async function cacheFirst(request, cacheName, maxEntries, maxAgeSeconds) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    // Check if cache entry is still valid
    const dateHeader = cachedResponse.headers.get("sw-cache-date");
    if (dateHeader && maxAgeSeconds) {
      const cacheDate = new Date(dateHeader).getTime();
      const now = Date.now();
      if (now - cacheDate > maxAgeSeconds * 1000) {
        // Cache expired, fetch fresh
        return fetchAndCache(request, cache, maxEntries);
      }
    }
    return cachedResponse;
  }

  return fetchAndCache(request, cache, maxEntries);
}

/**
 * Stale-While-Revalidate Strategy
 * Returns cached response immediately while fetching fresh copy in background.
 * Best for: API responses
 */
async function staleWhileRevalidate(request, cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  // Always fetch fresh in background
  const fetchPromise = fetchAndCache(request, cache, maxEntries).catch(() => {
    // Network failed, cached version will be used
    return cachedResponse;
  });

  // Return cached immediately, or wait for network
  return cachedResponse || fetchPromise;
}

/**
 * Network-First Strategy
 * Tries network first, falls back to cache if offline.
 * Best for: dynamic page content
 */
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);

  try {
    const response = await fetch(request);
    if (response.ok) {
      const clonedResponse = response.clone();
      const headers = new Headers(clonedResponse.headers);
      headers.set("sw-cache-date", new Date().toISOString());
      const body = await clonedResponse.blob();
      const cachedResponse = new Response(body, {
        status: clonedResponse.status,
        statusText: clonedResponse.statusText,
        headers,
      });
      cache.put(request, cachedResponse);
    }
    return response;
  } catch {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) return cachedResponse;
    throw new Error("No cached response available");
  }
}

/**
 * Network-First with Offline Fallback
 * Tries network first, falls back to cache, then to offline page.
 * Best for: navigation requests
 */
async function networkFirstWithOfflineFallback(request) {
  try {
    const response = await fetch(request);
    // Cache successful navigation responses
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      const clonedResponse = response.clone();
      cache.put(request, clonedResponse);
    }
    return response;
  } catch {
    // Try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;

    // Fallback to offline page
    const offlineResponse = await caches.match("/offline");
    if (offlineResponse) return offlineResponse;

    // Last resort
    return new Response("You are offline", {
      status: 503,
      statusText: "Service Unavailable",
      headers: { "Content-Type": "text/html" },
    });
  }
}

/**
 * Fetch from network and cache the response
 */
async function fetchAndCache(request, cache, maxEntries) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const clonedResponse = response.clone();
      const headers = new Headers(clonedResponse.headers);
      headers.set("sw-cache-date", new Date().toISOString());
      const body = await clonedResponse.blob();
      const cachedResponse = new Response(body, {
        status: clonedResponse.status,
        statusText: clonedResponse.statusText,
        headers,
      });
      cache.put(request, cachedResponse);

      // Cleanup old entries if over limit
      trimCache(cache, maxEntries);
    }
    return response;
  } catch (error) {
    throw error;
  }
}

/**
 * Trim cache to maxEntries
 */
async function trimCache(cache, maxEntries) {
  const keys = await cache.keys();
  if (keys.length > maxEntries) {
    // Delete oldest entries
    const deleteCount = keys.length - maxEntries;
    for (let i = 0; i < deleteCount; i++) {
      await cache.delete(keys[i]);
    }
  }
}

// ========================================
// Message Handler (for skip waiting)
// ========================================
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    // @ts-expect-error - skipWaiting is valid on ServiceWorkerGlobalScope
    self.skipWaiting();
  }
});
