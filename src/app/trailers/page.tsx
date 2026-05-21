import type { Metadata } from "next";
import TrailersClient from "@/components/Trailers/TrailersClient";

export const metadata: Metadata = {
  title: "Movie Trailers & Teasers – Action, Horror, Sci-Fi | Unimovies",
  description:
    "Watch the latest official movie trailers and teasers in one place. Browse by genre (Action, Adventure, Horror, Sci-Fi, Comedy) and language (English, Hindi). Stay up to date with the biggest upcoming films.",
  keywords: [
    "movie trailers",
    "latest trailers",
    "movie teasers",
    "action trailers",
    "horror trailers",
    "hindi trailers",
    "upcoming movies",
    "official trailers",
    "bollywood trailers",
    "hollywood trailers",
  ],
  alternates: {
    canonical: "https://unimovies.vercel.app/trailers",
  },
  openGraph: {
    title: "Movie Trailers & Teasers | Unimovies",
    description:
      "Browse the latest movie trailers and teasers by genre and language — all in one place.",
    url: "https://unimovies.vercel.app/trailers",
    type: "website",
  },
};

export default function TrailersPage() {
  return <TrailersClient />;
}
