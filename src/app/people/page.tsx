import type { Metadata } from "next";
import People from "@/components/People/People";
import { generateBreadcrumbJsonLd, generateCollectionJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Popular Celebrities - Actors, Directors & Filmmakers",
  description:
    "Discover popular celebrities, actors, directors, and filmmakers on Unimovies. Browse detailed profiles with biographies, filmographies, social media links, photo galleries, and more.",
  keywords: [
    "popular celebrities",
    "famous actors",
    "movie directors",
    "filmmakers",
    "actor profiles",
    "celebrity biographies",
    "Hollywood actors",
    "Bollywood stars",
    "actress photos",
    "celebrity news",
    "entertainment industry",
    "film industry",
  ],
  alternates: {
    canonical: "https://unimovies.vercel.app/people",
  },
  openGraph: {
    title: "Popular Celebrities - Actors, Directors & Filmmakers | Unimovies",
    description:
      "Discover popular celebrities with detailed profiles, biographies, and filmographies.",
    url: "https://unimovies.vercel.app/people",
    type: "website",
  },
};

export default function PeoplePage() {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "People", path: "/people" },
  ]);

  const collectionJsonLd = generateCollectionJsonLd({
    name: "Popular Celebrities",
    description: "Discover popular actors, directors, and filmmakers with biographies, filmographies, and photo galleries.",
    path: "/people",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <People />
    </>
  );
}
