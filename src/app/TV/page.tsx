import type { Metadata } from "next";
import TV from "@/components/TV/TV";
import { generateBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Browse TV Shows - Popular Series, Top Rated & Trending",
  description:
    "Explore the best TV shows on Unimovies. Browse popular series, top-rated dramas, trending comedies, and award-winning shows. Get episode info, ratings, cast details, and synopses.",
  keywords: [
    "TV shows",
    "popular TV series",
    "top rated TV shows",
    "trending series",
    "best TV dramas",
    "TV show database",
    "new TV series",
    "binge watch",
    "streaming shows",
    "TV ratings",
    "series reviews",
    "television shows",
  ],
  alternates: {
    canonical: "https://unimovies.vercel.app/tv",
  },
  openGraph: {
    title: "Browse TV Shows - Popular Series, Top Rated & Trending | Unimovies",
    description:
      "Discover the best TV series. Browse popular shows, top-rated dramas, and trending comedies.",
    url: "https://unimovies.vercel.app/tv",
    type: "website",
  },
};

export default function TVPage() {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "TV Shows", path: "/tv" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <TV />
    </>
  );
}
