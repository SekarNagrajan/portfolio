import Link from "next/link";
import { Section, SectionHeader } from "@/components/features/Section";
import { CountUp, SpotlightCard } from "@/components/motion/Effects";
import { AboutHero } from "@/components/features/about/AboutHero";
import { Journey, JourneyOverview } from "@/components/features/about/Journey";
import { Principles } from "@/components/features/about/Principles";
import { Credentials } from "@/components/features/about/Credentials";
import {
  AwardIcon,
  BriefcaseIcon,
  CodeIcon,
  GlobeIcon,
  HomeIcon,
  ZapIcon,
} from "@/components/icons/AnimatedIcons";
import { profile } from "@/lib/data/profile";
import { experiences } from "@/lib/data/experiences";
import { breadcrumbJsonLd, buildMetadata, profilePageJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = buildMetadata({
  title: "About",
  description: `About ${profile.name} — ${profile.summary}`,
  path: "/about",
});

const STATS = [
  { to: 3, suffix: "+", label: "Years shipping production software" },
  { to: 4, suffix: "", label: "Multi-tenant platforms shipped" },
  { to: 40, suffix: "+", label: "Screens architected in ANCHOR" },
  { to: 36, suffix: "", label: "Products on the platform I build for" },
] as const;

export default function AboutPage() {
  const current = experiences[0];

  const nutshell = [
    {
      icon: CodeIcon,
      title: "What I do",
      body: (
        <>
          I design and ship full-stack enterprise platforms end to end: React 19 frontends with strict type safety and
          design systems, Spring Boot 4 services on Java 21, and multi-datasource SQL Server underneath.
        </>
      ),
    },
    {
      icon: GlobeIcon,
      title: "Where I do it",
      body: (
        <>
          At{" "}
          <Link
            href={current.companyUrl ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-accent underline-offset-4 hover:underline"
          >
            {current.company}
          </Link>
          , a maritime enterprise software vendor since 2003. I architect multi-tenant products for shipping lines and
          port agents: tenant branding, RBAC across 40+ screens, and AI folded into existing workflows.
        </>
      ),
    },
    {
      icon: ZapIcon,
      title: "What I care about",
      body: (
        <>
          The craft: tight motion design, strict Core Web Vitals, keyboard-first accessibility, and architecture that
          holds up under production load. This site is a working example, with Server Components, Server Actions and
          forms that submit even without JavaScript.
        </>
      ),
    },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbJsonLd([{ name: "About", path: "/about" }]), profilePageJsonLd()]} />

      <AboutHero />

      {/* In a nutshell + numbers */}
      <Section id="about-intro">
        <div className="grid gap-5 md:grid-cols-3">
          {nutshell.map(({ icon: Icon, title, body }, i) => (
            <SpotlightCard key={title} index={i} className="flex flex-col p-7 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
                  <Icon size={20} strokeWidth={1.75} />
                </span>
                <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
              </div>
              <p className="mt-5 text-pretty leading-relaxed text-foreground/80">{body}</p>
            </SpotlightCard>
          ))}
        </div>

        <dl className="glass mt-5 grid grid-cols-2 divide-border/60 overflow-hidden rounded-2xl lg:grid-cols-4 lg:divide-x">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`relative p-6 sm:p-8 ${i % 2 ? "border-l border-border/60 lg:border-l-0" : ""} ${i < 2 ? "border-b border-border/60 lg:border-b-0" : ""}`}
            >
              <dd className="text-4xl font-semibold tracking-tight text-gradient sm:text-5xl">
                <CountUp to={s.to} suffix={s.suffix} />
              </dd>
              <dt className="mt-2 text-sm text-muted-foreground">{s.label}</dt>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="journey">
        <SectionHeader
          eyebrow="My journey"
          icon={<BriefcaseIcon size={14} trigger="self" />}
          title={
            <>
              From classroom to <span className="text-gradient">enterprise scale</span>.
            </>
          }
          description="The milestones that got me here: education, my current role, and the products I've shipped along the way."
          art={<JourneyOverview />}
        />
        <Journey />
      </Section>

      <Section id="principles">
        <SectionHeader
          eyebrow="Principles"
          icon={<HomeIcon size={14} trigger="self" />}
          title="How I work."
          description="Four habits I bring to every team, and where each one shows up in my actual work."
        />
        <Principles />
      </Section>

      <Section id="education">
        <SectionHeader
          eyebrow="Credentials"
          icon={<AwardIcon size={14} trigger="self" />}
          title="Foundations in CS."
          description="A computer science degree and focused training in the stack I use every day."
        />
        <Credentials />
      </Section>
    </>
  );
}
