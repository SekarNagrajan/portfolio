import Link from "next/link";
import { Section, SectionHeader } from "@/components/features/Section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { profile } from "@/lib/data/profile";
import { education, certifications } from "@/lib/data/education";
import { experiences } from "@/lib/data/experiences";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About",
  description: `About ${profile.name} — ${profile.summary}`,
  path: "/about",
});

export default function AboutPage() {
  const current = experiences[0];

  return (
    <>
      <Section id="about-intro">
        <SectionHeader
          eyebrow="About"
          title={`Hi, I'm ${profile.firstName}.`}
          description={profile.summary}
        />

        <div className="grid gap-10 md:grid-cols-[1.5fr,1fr]">
          <div className="space-y-6 text-base leading-relaxed text-foreground/90">
            <p>
              I design and ship full-stack enterprise platforms end-to-end —
              from React 19 frontends with strict type safety and
              component-driven design systems, to Spring Boot 4 services on
              Java 21 running against multi-datasource SQL Server deployments.
            </p>
            <p>
              Day to day I architect multi-tenant SaaS products at{" "}
              <Link
                href={current.companyUrl ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-accent hover:underline"
              >
                {current.company}
              </Link>
              , a maritime enterprise system vendor shipping software for
              shipping lines since 2003. The problems look like: tenant
              branding at scale, RBAC + module gating across 40+ screens,
              streaming high-cardinality operational data into AG Grid, and
              folding AI (OpenAI, Google Cloud Vision, N8N) into existing
              workflows without breaking them.
            </p>
            <p>
              I care deeply about the craft — pixel-tight motion design,
              strict Core Web Vitals, keyboard-first accessibility, and
              architecture that holds up under production load. The portfolio
              you&apos;re reading is a working example: Next.js 15 Server
              Components, zero-boilerplate React 19 Server Actions, a Tailwind
              v4 oklch design system, and progressive-enhancement forms that
              submit even with JavaScript disabled.
            </p>
          </div>

          <aside className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Based in
              </h3>
              <p className="mt-2 text-lg font-medium text-foreground">
                {profile.location}
              </p>
              <h3 className="mt-5 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Reach me
              </h3>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>
                  <Link
                    href={profile.socials.email}
                    className="hover:text-foreground"
                  >
                    {profile.email}
                  </Link>
                </li>
                <li>{profile.phone}</li>
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button asChild size="sm">
                  <Link href="/contact">Say hello</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/resume">View resume</Link>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </Section>

      <Section id="education" className="border-t border-border/60">
        <SectionHeader
          eyebrow="Education"
          title="Foundations in Computer Science and Engineering."
        />
        <ul className="space-y-6">
          {education.map((ed) => (
            <li
              key={ed.id}
              className="flex flex-col gap-1 rounded-xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-start sm:justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {ed.degree}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {ed.institution} · {ed.location}
                </p>
              </div>
              <div className="flex flex-col items-start gap-1 sm:items-end">
                <span className="font-mono text-sm text-muted-foreground">
                  {ed.period}
                </span>
                <Badge variant="accent">{ed.score}</Badge>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="certifications" className="border-t border-border/60">
        <SectionHeader
          eyebrow="Certifications"
          title="Formal training and continuing education."
        />
        <ul className="space-y-4">
          {certifications.map((c) => (
            <li
              key={c.id}
              className="flex flex-col gap-1 rounded-xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h3 className="font-medium text-foreground">{c.title}</h3>
                <p className="text-sm text-muted-foreground">{c.issuer}</p>
              </div>
              <span className="font-mono text-sm text-muted-foreground">
                {c.period}
              </span>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
