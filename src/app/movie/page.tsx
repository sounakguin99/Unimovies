import type { Metadata } from "next";
import AllmoviesTMDB from "@/components/Movie/AllmoviesTMDB";
import { generateBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Browse All Movies - Popular, Top Rated & Now Playing",
  description:
    "Explore a vast collection of movies on Unimovies. Discover popular films, top-rated masterpieces, now playing in theaters, and upcoming releases. Find ratings, reviews, and detailed movie information.",
  keywords: [
    "all movies",
    "popular movies",
    "top rated movies",
    "now playing movies",
    "upcoming movies",
    "movie list",
    "best movies",
    "new movies",
    "movie database",
    "film collection",
    "movie ratings",
    "watch movies",
  ],
  alternates: {
    canonical: "https://unimovies.vercel.app/movie",
  },
  openGraph: {
    title: "Browse All Movies - Popular, Top Rated & Now Playing | Unimovies",
    description:
      "Discover popular films, top-rated masterpieces, and upcoming releases. Your complete movie database.",
    url: "https://unimovies.vercel.app/movie",
    type: "website",
  },
};

export default function AllMoviesPage() {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Movies", path: "/movie" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <AllmoviesTMDB />
    </>
  );
}
