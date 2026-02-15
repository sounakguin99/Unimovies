import type { Metadata } from "next";
import SinglepagePeople from "@/components/People/SinglepagePeople";
import { generatePersonJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://unimovies.vercel.app";

/**
 * Generate dynamic metadata for individual person/celebrity pages.
 * Fetches person data server-side so Google can crawl the correct title, description, and OG tags.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/person/${id}?api_key=${TMDB_API_KEY}&language=en-US`,
      { next: { revalidate: 86400 } },
    );

    if (!response.ok) {
      return {
        title: "Celebrity Not Found",
        description:
          "The requested celebrity profile could not be found on Unimovies.",
      };
    }

    const person = await response.json();

    const name = person.name || "Celebrity";
    const department = person.known_for_department || "Entertainment";
    const biography = person.biography || "";
    const birthInfo = person.birthday
      ? ` Born ${person.birthday}${person.place_of_birth ? ` in ${person.place_of_birth}` : ""}.`
      : "";

    const description =
      biography.substring(0, 140) ||
      `${name} - ${department} professional.${birthInfo} Explore full biography, filmography, photos, and social media on Unimovies.`;

    const ogImage = person.profile_path
      ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
      : undefined;

    return {
      title: `${name} - Biography, Filmography & Photos`,
      description: description.substring(0, 160),
      keywords: [
        name,
        `${name} movies`,
        `${name} TV shows`,
        `${name} biography`,
        `${name} filmography`,
        `${name} photos`,
        `${name} age`,
        department,
        "celebrity profile",
        "actor biography",
        "filmmaker",
      ],
      alternates: {
        canonical: `${BASE_URL}/people/${id}`,
      },
      openGraph: {
        title: `${name} - ${department} | Unimovies`,
        description: description.substring(0, 200),
        url: `${BASE_URL}/people/${id}`,
        type: "profile",
        images: ogImage
          ? [
              {
                url: ogImage,
                width: 500,
                height: 750,
                alt: `${name} - Photo`,
              },
            ]
          : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: `${name} - ${department}`,
        description: description.substring(0, 200),
        images: ogImage ? [ogImage] : undefined,
      },
    };
  } catch {
    return {
      title: "Celebrity Profile",
      description:
        "Explore celebrity profiles with biographies, filmographies, and photo galleries on Unimovies.",
    };
  }
}

interface PersonData {
  id: number;
  name: string;
  biography: string;
  birthday?: string;
  place_of_birth?: string;
  profile_path: string | null;
  known_for_department?: string;
}

export default async function PersonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let personJsonLd = null;
  let breadcrumbJsonLd = null;

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/person/${id}?api_key=${TMDB_API_KEY}&language=en-US`,
      { next: { revalidate: 86400 } },
    );
    if (response.ok) {
      const person: PersonData = await response.json();
      personJsonLd = generatePersonJsonLd(person);
      breadcrumbJsonLd = generateBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "People", path: "/people" },
        { name: person.name || "Celebrity", path: `/people/${id}` },
      ]);
    }
  } catch {
    // Fail silently
  }

  return (
    <>
      {personJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      )}
      {breadcrumbJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      )}
      <SinglepagePeople />
    </>
  );
}
