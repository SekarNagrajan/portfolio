import type { Metadata } from "next";
import { profile } from "@/lib/data/profile";

/**
 * Site-wide base URL.
 * Falls back to localhost for `next dev` but MUST be set to the production
 * origin (`https://<domain>`) via NEXT_PUBLIC_SITE_URL on Vercel so that
 * absolute OG/Twitter URLs resolve correctly on social crawlers.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Per-route metadata builder.
 * - Produces absolute `openGraph` URLs tied to our dynamic OG endpoint.
 * - Sets canonical link so duplicate paths don't dilute PageRank.
 */
export function buildMetadata(opts: {
  title: string;
  description: string;
  path: string;
  ogTitle?: string;
}): Metadata {
  const canonical = new URL(opts.path, SITE_URL).toString();
  const ogImage = new URL(
    `/api/og?title=${encodeURIComponent(opts.ogTitle ?? opts.title)}`,
    SITE_URL,
  ).toString();

  const fullTitle = `${opts.title} — ${profile.name}`;

  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical },
    openGraph: {
      title: fullTitle,
      description: opts.description,
      url: canonical,
      siteName: `${profile.name} — ${profile.title}`,
      type: "website",
      locale: "en_IN",
      images: [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: opts.description,
      images: [ogImage],
    },
  };
}

/**
 * JSON-LD `Person` schema injected on the root layout.
 * Rich result eligibility for Google and semantic linking to GitHub +
 * LinkedIn for knowledge graph assembly.
 */
export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: SITE_URL,
    jobTitle: profile.title,
    email: profile.email,
    telephone: profile.phone,
    description: profile.summary,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Chennai",
      addressRegion: "Tamil Nadu",
      addressCountry: "IN",
    },
    worksFor: {
      "@type": "Organization",
      name: "Solverminds Solutions and Technologies",
      url: "https://www.solverminds.com/",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Mahendra Engineering College",
    },
    sameAs: [profile.socials.github, profile.socials.linkedin],
    knowsAbout: [
      "React 19",
      "Next.js 15",
      "TypeScript",
      "Spring Boot 4",
      "Java 21",
      "Multi-tenant Architecture",
      "SQL Server",
      "Enterprise Design Systems",
      "AI Workflow Automation",
    ],
  } as const;
}
