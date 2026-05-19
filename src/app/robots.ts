import type { MetadataRoute } from "next";

/**
 * robots.txt generation for Unimovies.
 * Tells search engine crawlers which pages to index and which to skip.
 * Accessible at /robots.txt automatically via Next.js App Router.
 *
 * SEO Strategy:
 * - Allow all main content pages (movies, TV, people, awards)
 * - Block internal/utility routes to preserve crawl budget
 * - Provide sitemap location for efficient discovery
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://unimovies.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/api/",
          "/offline",
          "/_next/",
          "/icons/",
        ],
      },
      {
        // Googlebot-specific (most important crawler)
        userAgent: "Googlebot",
        allow: ["/"],
        disallow: ["/api/", "/offline"],
      },
      {
        // Bing
        userAgent: "Bingbot",
        allow: ["/"],
        disallow: ["/api/", "/offline"],
      },
      {
        // Block AI training crawlers (protect content)
        userAgent: "GPTBot",
        disallow: ["/"],
      },
      {
        userAgent: "ChatGPT-User",
        disallow: ["/"],
      },
      {
        userAgent: "CCBot",
        disallow: ["/"],
      },
      {
        userAgent: "Google-Extended",
        disallow: ["/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
