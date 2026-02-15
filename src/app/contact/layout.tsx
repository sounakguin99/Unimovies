import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Get in Touch with Unimovies",
  description:
    "Have questions or feedback about Unimovies? Contact our team via email, phone, or our online form. We'd love to hear from you and respond within 24 hours.",
  keywords: [
    "contact Unimovies",
    "Unimovies support",
    "movie website contact",
    "customer support",
    "feedback",
    "get in touch",
  ],
  alternates: {
    canonical: "https://unimovies.vercel.app/contact",
  },
  openGraph: {
    title: "Contact Us - Get in Touch | Unimovies",
    description:
      "Have questions about Unimovies? Reach out to our team. We'd love to hear from you.",
    url: "https://unimovies.vercel.app/contact",
    type: "website",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
