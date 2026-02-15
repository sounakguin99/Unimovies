import type { Metadata } from "next";
import Index from "@/components/Index";
import { generateBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Unimovies - Discover Movies, TV Shows & Celebrities",
  description:
    "Browse trending movies, top-rated TV shows, and popular celebrities. Get detailed information including ratings, cast, synopsis, and trailers — all in one place on Unimovies.",
  keywords: [
    "trending movies 2026",
    "popular TV shows",
    "new movie releases",
    "top rated movies",
    "movie ratings",
    "watch movies online",
    "best TV series",
    "celebrity news",
    "entertainment hub",
    "movie trailers",
    "upcoming movies",
    "box office",
  ],
  alternates: {
    canonical: "https://unimovies.vercel.app",
  },
  openGraph: {
    title: "Unimovies - Discover Movies, TV Shows & Celebrities",
    description:
      "Your ultimate entertainment companion. Browse trending movies, top-rated TV shows, and popular celebrities.",
    url: "https://unimovies.vercel.app",
    type: "website",
  },
};

export default function Home() {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", path: "/" },
  ]);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Index />
    </main>
  );
}
