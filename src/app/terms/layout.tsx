import type { Metadata } from "next";
import { generateBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms & Conditions - Usage Guidelines",
  description:
    "Read the terms and conditions governing your use of Unimovies. Understand your rights, responsibilities, intellectual property policies, and disclaimers.",
  keywords: [
    "terms and conditions",
    "terms of service",
    "unimovies terms",
    "user agreement",
    "usage guidelines",
    "legal",
  ],
  alternates: {
    canonical: "https://unimovies.vercel.app/terms",
  },
  openGraph: {
    title: "Terms & Conditions | Unimovies",
    description: "Review the terms governing your use of Unimovies services.",
    url: "https://unimovies.vercel.app/terms",
    type: "website",
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Terms & Conditions", path: "/terms" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
