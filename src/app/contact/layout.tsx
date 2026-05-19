import type { Metadata } from "next";
import { generateBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact Us - Get in Touch with Unimovies",
  description:
    "Have questions, feedback, or partnership inquiries? Contact the Unimovies team via email, phone, or our contact form. We're here to help with all your entertainment needs.",
  keywords: [
    "contact unimovies",
    "unimovies support",
    "movie website contact",
    "entertainment support",
    "feedback",
    "partnership",
    "customer service",
  ],
  alternates: {
    canonical: "https://unimovies.vercel.app/contact",
  },
  openGraph: {
    title: "Contact Us - Get in Touch with Unimovies",
    description:
      "Have questions or feedback? Reach out to the Unimovies team. We're here to help.",
    url: "https://unimovies.vercel.app/contact",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Contact Us | Unimovies",
    description: "Get in touch with the Unimovies team for questions, feedback, or partnerships.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
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
