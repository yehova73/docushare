import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";
import "./globals.css";
import { GeneralProviders } from "@/components/providers";
import { Analytics } from "@vercel/analytics/next";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tabzo: The Chrome Workspace Manager for Power Users",
  description:
    "Turn active Chrome windows into persistent, synced workspaces. Capture window setups, customize focus hubs with Tab-0, and time-travel through tab history.",
  keywords: [
    "Chrome workspace manager",
    "tab manager extension",
    "browser window saved session",
    "Workona alternative",
    "Toby tab manager alternative",
    "tab snapshot history",
    "productivity chrome extension",
    "context switching tool",
  ],
  authors: [{ name: "Tabzo" }],
  creator: "Tabzo",
  publisher: "Tabzo",
  metadataBase: new URL("https://tabzo.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Tabzo: Freeze, Focus, and Restore Your Browser Workspaces",
    description:
      "Stop losing your tab setups. Tabzo converts Chrome windows into tracked workspaces with live syncing, Tab-0 focus hubs, and instant state recovery.",
    url: "https://tabzo.app",
    siteName: "Tabzo",
    images: [
      {
        url: "/og-landing.png", // Recommended: 1200x630px showcase graphic
        width: 1200,
        height: 630,
        alt: "Tabzo Chrome Extension & SaaS Dashboard Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tabzo: The Chrome Workspace Manager for Power Users",
    description:
      "Freeze active Chrome windows, sync tabs in real-time, and time-travel back to any past browser session.",
    images: ["/og-landing.png"],
    creator: "@tabzoapp", // Replace with your X handle if applicable
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <GeneralProviders>{children}</GeneralProviders>
        <Analytics />
      </body>
    </html>
  );
}
