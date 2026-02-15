import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions - Rules of Use",
  description:
    "Review the Terms and Conditions for using Unimovies services. Understand your rights, responsibilities, and our policies for content, intellectual property, and usage.",
  keywords: [
    "terms and conditions",
    "terms of service",
    "Unimovies terms",
    "user agreement",
    "legal",
    "intellectual property",
    "content policy",
  ],
  alternates: {
    canonical: "https://unimovies.vercel.app/terms",
  },
  openGraph: {
    title: "Terms & Conditions | Unimovies",
    description:
      "Review the terms governing your use of Unimovies services and platforms.",
    url: "https://unimovies.vercel.app/terms",
    type: "website",
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
