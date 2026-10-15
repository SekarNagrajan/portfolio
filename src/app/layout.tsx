import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";
import { Navbar } from "@/components/features/Navbar";
import { Footer } from "@/components/features/Footer";
import { Background } from "@/components/layout/Background";
import { Providers } from "@/components/layout/Providers";
import { TrackClicks } from "@/components/layout/TrackClicks";
import { themeInitScript } from "@/components/layout/Theme";
import { ScrollProgress } from "@/components/motion/Effects";
import { SITE_URL, personJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { brand } from "@/lib/brand";
import { profile } from "@/lib/data/profile";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/* ---------- Metadata ---------- */

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${profile.name} — ${profile.title}`,
    template: `%s — ${profile.name}`,
  },
  description: profile.summary,
  applicationName: `${profile.name} — Portfolio`,
  authors: [{ name: profile.name, url: SITE_URL }],
  creator: profile.name,
  keywords: [
    "Sekar Nagarajan",
    "Full-Stack Software Engineer",
    "React 19",
    "Next.js 16",
    "Spring Boot 4",
    "Java 21",
    "TypeScript",
    "Multi-Tenant Architecture",
    "Enterprise Design Systems",
    "Maritime Software",
    "Solverminds",
  ],
  openGraph: {
    type: "website",
    siteName: `${profile.name} — ${profile.title}`,
    url: SITE_URL,
    title: `${profile.name} — ${profile.title}`,
    description: profile.summary,
    locale: "en_IN",
    images: [
      {
        url: `${SITE_URL}/api/og`,
        width: 1200,
        height: 630,
        alt: `${profile.name} — ${profile.title}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.title}`,
    description: profile.summary,
    images: [`${SITE_URL}/api/og`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: brand.background },
    { media: "(prefers-color-scheme: light)", color: brand.backgroundLight },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

/* ---------- Layout ---------- */

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Apply the saved theme before first paint (no flash). */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      {/* Extensions (Grammarly, password managers) inject attributes on
          <body> before hydration; ignore those attribute-only mismatches. */}
      <body
        className="relative isolate flex min-h-dvh flex-col bg-background text-foreground"
        suppressHydrationWarning
      >
        {/* JSON-LD Person — rich-result eligibility + knowledge-graph signal. */}
        <JsonLd data={personJsonLd()} />

        {/* Skip-to-content for keyboard + screen-reader users. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-foreground focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-background"
        >
          Skip to content
        </a>

        <Providers>
          <Background />
          <ScrollProgress />
          <Navbar />

          <main id="main" className="flex-1">
            {children}
          </main>

          <Footer />
        </Providers>

        <Analytics />
        <TrackClicks />
        <SpeedInsights />
      </body>
    </html>
  );
}
