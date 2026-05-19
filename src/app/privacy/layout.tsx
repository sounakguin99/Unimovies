import type { Metadata } from "next";
import { generateBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy - How We Protect Your Data",
  description:
    "Learn how Unimovies collects, uses, and protects your personal information. Read our comprehensive privacy policy covering data security, cookies, and your rights.",
  keywords: [
    "privacy policy",
    "data protection",
    "unimovies privacy",
    "cookie policy",
    "user data security",
    "GDPR",
  ],
  alternates: {
    canonical: "https://unimovies.vercel.app/privacy",
  },
  openGraph: {
    title: "Privacy Policy | Unimovies",
    description: "Learn how Unimovies protects your personal data and privacy.",
    url: "https://unimovies.vercel.app/privacy",
    type: "website",
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Privacy Policy", path: "/privacy" },
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
