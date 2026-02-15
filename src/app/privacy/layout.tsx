import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - How We Protect Your Data",
  description:
    "Read Unimovies' Privacy Policy to understand how we collect, use, and protect your personal data. We are committed to safeguarding your privacy and security.",
  keywords: [
    "privacy policy",
    "data protection",
    "Unimovies privacy",
    "personal data",
    "cookies",
    "data security",
    "GDPR",
  ],
  alternates: {
    canonical: "https://unimovies.vercel.app/privacy",
  },
  openGraph: {
    title: "Privacy Policy | Unimovies",
    description:
      "Learn how Unimovies collects, uses, and protects your personal data.",
    url: "https://unimovies.vercel.app/privacy",
    type: "website",
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
