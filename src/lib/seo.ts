import type { Metadata } from "next";

const BASE_URL = "https://unimovies.vercel.app";
const SITE_NAME = "Unimovies";
const DEFAULT_OG_IMAGE = `${BASE_URL}/icons/icon-512.png`;

/**
 * Generate comprehensive SEO metadata for any page.
 * Includes Open Graph, Twitter Card, canonical URL, and structured data support.
 */
export function generateSEOMetadata({
  title,
  description,
  path = "",
  ogImage,
  ogType = "website",
  keywords = [],
  noIndex = false,
  additionalMeta = {},
}: {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "video.movie" | "video.tv_show" | "profile";
  keywords?: string[];
  noIndex?: boolean;
  additionalMeta?: Record<string, string>;
}): Metadata {
  const url = `${BASE_URL}${path}`;
  const image = ogImage || DEFAULT_OG_IMAGE;

  const defaultKeywords = [
    "movies",
    "TV shows",
    "celebrities",
    "movie reviews",
    "trending movies",
    "popular TV shows",
    "movie database",
    "film ratings",
    "Unimovies",
    "entertainment",
    "streaming",
    "Hollywood",
    "Bollywood",
    "TMDB",
  ];

  const allKeywords = [...new Set([...defaultKeywords, ...keywords])];

  return {
    title,
    description,
    keywords: allKeywords,
    authors: [{ name: SITE_NAME, url: BASE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large" as const,
          "max-snippet": -1,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large" as const,
            "max-snippet": -1,
          },
        },
    openGraph: {
      type: ogType,
      locale: "en_US",
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@unimovies",
      site: "@unimovies",
    },
    other: {
      "google-site-verification": "your-google-verification-code-here",
      ...additionalMeta,
    },
  };
}

/**
 * Generate JSON-LD structured data for a Movie.
 * This helps Google display rich results (rich snippets) in search.
 */
export function generateMovieJsonLd(movie: {
  id: number;
  original_title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count?: number;
  poster_path?: string;
  backdrop_path?: string;
  genres?: { id: number; name: string }[];
  runtime?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: movie.original_title,
    description: movie.overview,
    datePublished: movie.release_date,
    image: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : undefined,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: movie.vote_average?.toFixed(1),
      bestRating: "10",
      worstRating: "0",
      ratingCount: movie.vote_count || 0,
    },
    genre: movie.genres?.map((g) => g.name) || [],
    duration: movie.runtime ? `PT${movie.runtime}M` : undefined,
    url: `${BASE_URL}/movie/${movie.id}`,
  };
}

/**
 * Generate JSON-LD structured data for a TV Show.
 */
export function generateTVShowJsonLd(show: {
  id: number;
  name: string;
  overview: string;
  first_air_date: string;
  vote_average: number;
  vote_count?: number;
  poster_path?: string;
  genres?: { id: number; name: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    name: show.name,
    description: show.overview,
    datePublished: show.first_air_date,
    image: show.poster_path
      ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
      : undefined,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: show.vote_average?.toFixed(1),
      bestRating: "10",
      worstRating: "0",
      ratingCount: show.vote_count || 0,
    },
    genre: show.genres?.map((g) => g.name) || [],
    url: `${BASE_URL}/tv/${show.id}`,
  };
}

/**
 * Generate JSON-LD structured data for a Person (actor/director).
 */
export function generatePersonJsonLd(person: {
  id: number;
  name: string;
  biography: string;
  birthday?: string;
  place_of_birth?: string;
  profile_path?: string | null;
  known_for_department?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    description: person.biography?.substring(0, 300) || `${person.name} - ${person.known_for_department || "Entertainment"}`,
    birthDate: person.birthday || undefined,
    birthPlace: person.place_of_birth || undefined,
    image: person.profile_path
      ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
      : undefined,
    jobTitle: person.known_for_department || undefined,
    url: `${BASE_URL}/people/${person.id}`,
  };
}

/**
 * Generate JSON-LD structured data for the website (Organization + WebSite).
 * This should be placed in the root layout.
 */
export function generateWebsiteJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      alternateName: "Unimovies - Movie Database",
      url: BASE_URL,
      description:
        "Discover movies, TV shows, and celebrities. Your ultimate entertainment companion with trending content, reviews, and more.",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${BASE_URL}/movie?search={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE_NAME,
      url: BASE_URL,
      logo: `${BASE_URL}/icons/icon-512.png`,
      sameAs: [
        "https://twitter.com/unimovies",
        "https://facebook.com/unimovies",
        "https://instagram.com/unimovies",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: "support@unimovies.com",
      },
    },
  ];
}

/**
 * Generate BreadcrumbList JSON-LD for better navigation in search results.
 */
export function generateBreadcrumbJsonLd(
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.path}`,
    })),
  };
}
