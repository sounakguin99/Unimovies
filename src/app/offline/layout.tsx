import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offline - No Internet Connection",
  description:
    "You are currently offline. Please check your internet connection and try again. Cached pages may still be available.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OfflineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
