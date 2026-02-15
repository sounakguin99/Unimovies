import type { Metadata } from "next";
import Moviedetail from "@/components/Movie/Moviedetail";
import { generateMovieJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://unimovies.vercel.app";

/**
 * Generate dynamic metadata for individual movie pages.
 * Fetches movie data server-side so Google can crawl the correct title, description, and OG tags.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`,
      { next: { revalidate: 86400 } }, // Cache for 24 hours
    );

    if (!response.ok) {
      return {
        title: "Movie Not Found",
        description: "The requested movie could not be found on Unimovies.",
      };
    }

    const movie = await response.json();

    const title = movie.original_title || movie.title || "Movie";
    const year = movie.release_date
      ? ` (${new Date(movie.release_date).getFullYear()})`
      : "";
    const rating = movie.vote_average
      ? ` ★ ${movie.vote_average.toFixed(1)}/10`
      : "";
    const genres = movie.genres?.map((g: any) => g.name).join(", ") || "";
    const description =
      movie.overview ||
      `Watch ${title}${year} on Unimovies. ${genres ? `Genre: ${genres}.` : ""} Get ratings, cast info, and more.`;

    const ogImage = movie.backdrop_path
      ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
      : movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : undefined;

    return {
      title: `${title}${year} - Movie Details & Rating${rating}`,
      description: description.substring(0, 160),
      keywords: [
        title,
        `${title} movie`,
        `${title} review`,
        `${title} rating`,
        `${title} cast`,
        `${title} synopsis`,
        `watch ${title}`,
        ...genres.split(", ").filter(Boolean),
        "movie details",
        "film review",
      ],
      alternates: {
        canonical: `${BASE_URL}/movie/${id}`,
      },
      openGraph: {
        title: `${title}${year}${rating}`,
        description: description.substring(0, 200),
        url: `${BASE_URL}/movie/${id}`,
        type: "video.movie",
        images: ogImage
          ? [
              {
                url: ogImage,
                width: 1280,
                height: 720,
                alt: `${title} - Movie Poster`,
              },
            ]
          : undefined,
        releaseDate: movie.release_date || undefined,
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
      title: "Movie Details",
      description:
        "Get detailed movie information including ratings, cast, synopsis, and trailers on Unimovies.",
    };
  }
}

interface MovieData {
  id: number;
  original_title: string;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  poster_path: string | null;
  backdrop_path: string | null;
  genres: { id: number; name: string }[];
  runtime: number;
}

export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch movie data server-side for JSON-LD structured data
  let movieJsonLd = null;
  let breadcrumbJsonLd = null;

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`,
      { next: { revalidate: 86400 } },
    );
    if (response.ok) {
      const movie: MovieData = await response.json();
      movieJsonLd = generateMovieJsonLd({
        ...movie,
        poster_path: movie.poster_path || undefined,
        backdrop_path: movie.backdrop_path || undefined,
      });
      breadcrumbJsonLd = generateBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Movies", path: "/movie" },
        {
          name: movie.original_title || movie.title || "Movie",
          path: `/movie/${id}`,
        },
      ]);
    }
  } catch {
    // Fail silently — JSON-LD is enhancement, not critical
  }

  return (
    <>
      {movieJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(movieJsonLd) }}
        />
      )}
      {breadcrumbJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      )}
      <Moviedetail />
    </>
  );
}
