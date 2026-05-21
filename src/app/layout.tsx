import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import { Providers } from "../components/Providers";
import OfflineBanner from "../components/OfflineBanner";
import PWAUpdateNotification from "../components/PWAUpdateNotification";
import ServiceWorkerRegistrar from "../components/ServiceWorkerRegistrar";
import WhatsAppButton from "../components/WhatsAppButton";
import MovieAIChatbot from "../components/MovieAIChatbot";
import { generateWebsiteJsonLd } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://unimovies.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Unimovies - Discover Movies, TV Shows & Celebrities",
    template: "%s | Unimovies",
  },
  description:
    "Explore trending movies, popular TV shows, and celebrity profiles on Unimovies. Get ratings, reviews, synopses, cast details, and more — your ultimate entertainment companion.",
  keywords: [
    "movies",
    "TV shows",
    "celebrities",
    "movie reviews",
    "trending movies",
    "popular TV shows",
    "movie database",
    "film ratings",
    "Unimovies",
    "entertainment",
    "streaming",
    "Hollywood",
    "Bollywood",
    "TMDB",
    "movie trailers",
    "TV series",
    "actor profiles",
    "film synopsis",
    "box office",
    "upcoming movies",
  ],
  authors: [{ name: "Unimovies", url: BASE_URL }],
  creator: "Unimovies",
  publisher: "Unimovies",
  manifest: "/manifest.json",
  alternates: {
    canonical: BASE_URL,
  },
  robots: {
    index: true,
    follow: true,
    "max-video-preview": -1,
    "max-image-preview": "large",
    "max-snippet": -1,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Unimovies",
    title: "Unimovies - Discover Movies, TV Shows & Celebrities",
    description:
      "Explore trending movies, popular TV shows, and celebrity profiles. Get ratings, reviews, synopses, and more.",
    images: [
      {
        url: "/icons/icon-512.png",
        width: 512,
        height: 512,
        alt: "Unimovies - Your Ultimate Movie Destination",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Unimovies - Discover Movies, TV Shows & Celebrities",
    description:
      "Explore trending movies, popular TV shows, and celebrity profiles. Your ultimate entertainment companion.",
    images: ["/icons/icon-512.png"],
    creator: "@unimovies",
    site: "@unimovies",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Unimovies",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#111827",
    "msapplication-tap-highlight": "no",
  },
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/icons/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      {
        url: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  category: "entertainment",
};

export const viewport: Viewport = {
  themeColor: "#111827",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteJsonLd = generateWebsiteJsonLd();

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#111827" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />

        {/* JSON-LD Structured Data for Website + Organization */}
        {websiteJsonLd.map((schema, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative min-h-screen bg-black text-white`}
      >
        <Providers>
          <Navbar />
          {children}
          <WhatsAppButton />
          <MovieAIChatbot />
          <OfflineBanner />
          <PWAUpdateNotification />
          <ServiceWorkerRegistrar />
        </Providers>
      </body>
    </html>
  );
}
