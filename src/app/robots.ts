import type { MetadataRoute } from "next";

/**
 * robots.txt generation for Unimovies.
 * Tells search engine crawlers which pages to index and which to skip.
 * Accessible at /robots.txt automatically via Next.js App Router.
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
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
