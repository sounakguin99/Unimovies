import type { Metadata } from "next";
import TVDetails from "@/components/TV/TVDetails";
import { generateTVShowJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://unimovies.vercel.app";

/**
 * Generate dynamic metadata for individual TV show pages.
 * Fetches TV data server-side so Google can crawl the correct title, description, and OG tags.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${id}?api_key=${TMDB_API_KEY}&language=en-US`,
      { next: { revalidate: 86400 } },
    );

    if (!response.ok) {
      return {
        title: "TV Show Not Found",
        description: "The requested TV show could not be found on Unimovies.",
      };
    }

    const show = await response.json();

    const title = show.name || show.original_name || "TV Show";
    const year = show.first_air_date
      ? ` (${new Date(show.first_air_date).getFullYear()})`
      : "";
    const rating = show.vote_average
      ? ` ★ ${show.vote_average.toFixed(1)}/10`
      : "";
    const genres = show.genres?.map((g: any) => g.name).join(", ") || "";
    const seasons = show.number_of_seasons
      ? ` | ${show.number_of_seasons} Season${show.number_of_seasons > 1 ? "s" : ""}`
      : "";
    const description =
      show.overview ||
      `Watch ${title}${year} on Unimovies.${seasons} ${genres ? `Genre: ${genres}.` : ""} Get ratings, cast info, and more.`;

    const ogImage = show.backdrop_path
      ? `https://image.tmdb.org/t/p/w1280${show.backdrop_path}`
      : show.poster_path
        ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
        : undefined;

    return {
      title: `${title}${year} - TV Show Details${rating}`,
      description: description.substring(0, 160),
      keywords: [
        title,
        `${title} TV show`,
        `${title} series`,
        `${title} review`,
        `${title} rating`,
        `${title} cast`,
        `${title} episodes`,
        `watch ${title}`,
        ...genres.split(", ").filter(Boolean),
        "TV series details",
        "show review",
      ],
      alternates: {
        canonical: `${BASE_URL}/tv/${id}`,
      },
      openGraph: {
        title: `${title}${year}${rating}${seasons}`,
        description: description.substring(0, 200),
        url: `${BASE_URL}/tv/${id}`,
        type: "video.tv_show",
        images: ogImage
          ? [
              {
                url: ogImage,
                width: 1280,
                height: 720,
                alt: `${title} - TV Show Poster`,
              },
            ]
          : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: `${title}${year}`,
        description: description.substring(0, 200),
        images: ogImage ? [ogImage] : undefined,
      },
    };
  } catch {
    return {
      title: "TV Show Details",
      description:
        "Get detailed TV show information including ratings, episodes, cast, and synopsis on Unimovies.",
    };
  }
}

interface TVShowData {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  poster_path: string | null;
  genres: { id: number; name: string }[];
}

export default async function TVDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let tvJsonLd = null;
  let breadcrumbJsonLd = null;

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${id}?api_key=${TMDB_API_KEY}&language=en-US`,
      { next: { revalidate: 86400 } },
    );
    if (response.ok) {
      const show: TVShowData = await response.json();
      tvJsonLd = generateTVShowJsonLd({
        ...show,
        poster_path: show.poster_path || undefined,
      });
      breadcrumbJsonLd = generateBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "TV Shows", path: "/tv" },
        {
          name: show.name || show.original_name || "TV Show",
          path: `/tv/${id}`,
        },
      ]);
    }
  } catch {
    // Fail silently
  }

  return (
    <>
      {tvJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(tvJsonLd) }}
        />
      )}
      {breadcrumbJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      )}
      <TVDetails />
    </>
  );
}
