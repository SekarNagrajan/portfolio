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
const PERSON_ID = `${SITE_URL}/#person`;

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
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
      "Next.js 16",
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

/** `BreadcrumbList` for an inner route: Home › … › current page. */
export function breadcrumbJsonLd(trail: readonly { name: string; path: string }[]) {
  const items = [{ name: "Home", path: "/" }, ...trail];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: new URL(item.path, SITE_URL).toString(),
    })),
  } as const;
}

/** `ProfilePage` for /about — tells search engines the page is about the Person. */
export function profilePageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: new URL("/about", SITE_URL).toString(),
    mainEntity: { "@id": PERSON_ID },
  } as const;
}

/** `CreativeWork` for a project case study, credited to the Person. */
export function caseStudyJsonLd(p: { title: string; description: string; path: string; keywords: readonly string[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: p.title,
    description: p.description,
    url: new URL(p.path, SITE_URL).toString(),
    keywords: p.keywords.join(", "),
    creator: { "@id": PERSON_ID },
  } as const;
}
