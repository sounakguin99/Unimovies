import type { Metadata } from "next";
import AwardsClient from "@/components/Awards/AwardsClient";
import { generateBreadcrumbJsonLd, generateCollectionJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Award-Winning Masterpieces - Oscars, Cannes & Golden Globes",
  description:
    "Explore the pinnacle of cinema on Unimovies. Discover Academy Award Best Picture winners, Cannes Palme d'Or champions, Golden Globe masterpieces, and acclaimed Animated Features.",
  keywords: [
    "award winning movies",
    "oscar winners",
    "best picture winners",
    "cannes palme d'or",
    "golden globe movies",
    "best animated features",
    "acclaimed cinema",
    "prestige movies",
    "movie awards",
    "film festivals",
    "academy awards",
    "oscar best picture",
    "golden globe best picture",
  ],
  alternates: {
    canonical: "https://unimovies.vercel.app/awards",
  },
  openGraph: {
    title: "Award-Winning Masterpieces - Oscars, Cannes & Golden Globes | Unimovies",
    description:
      "Discover Academy Award Best Picture winners, Cannes Palme d'Or champions, Golden Globe masterpieces, and acclaimed Animated Features.",
    url: "https://unimovies.vercel.app/awards",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Award-Winning Masterpieces | Unimovies",
    description: "Explore Oscar, Cannes, and Golden Globe winning films and acclaimed animated features.",
  },
};

export default function AwardsPage() {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Awards", path: "/awards" },
  ]);

  const collectionJsonLd = generateCollectionJsonLd({
    name: "Award-Winning Masterpieces",
    description: "Explore Academy Award winners, Cannes Palme d'Or champions, Golden Globe masterpieces, and acclaimed animated features.",
    path: "/awards",
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
      <AwardsClient />
    </>
  );
}
