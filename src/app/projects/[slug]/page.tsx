import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHeader, Section } from "@/components/features/Section";
import { HeaderArt } from "@/components/features/HeaderArt";
import { ArchitectureDiagram } from "@/components/features/case-study/ArchitectureDiagram";
import { CaseStudyToc } from "@/components/features/case-study/CaseStudyToc";
import { CountUp, SpotlightCard } from "@/components/motion/Effects";
import { Reveal, RevealItem, Stagger } from "@/components/motion/Reveal";
import {
  ArrowRightIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  LayersIcon,
  MotionLink,
} from "@/components/icons/AnimatedIcons";
import { TechLogo, logoForTech, monogramFor } from "@/components/icons/TechLogos";
import { JsonLd } from "@/components/seo/JsonLd";
import { caseStudies, getCaseStudy } from "@/lib/data/case-studies";
import { hoverTrigger } from "@/lib/motion";
import { breadcrumbJsonLd, buildMetadata, caseStudyJsonLd } from "@/lib/seo";

const SECTIONS = [
  { id: "problem", label: "The problem" },
  { id: "approach", label: "Approach" },
  { id: "architecture", label: "Architecture" },
  { id: "impact", label: "Impact" },
  { id: "stack", label: "Tech stack" },
] as const;

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const found = getCaseStudy(slug);
  if (!found) return { title: "Project not found" };
  return buildMetadata({
    title: found.study.title,
    description: found.study.tagline,
    path: `/projects/${slug}`,
  });
}

function SectionTitle({ id, index, children }: { id: string; index: number; children: React.ReactNode }) {
  return (
    <Reveal className="mb-6">
      <h2 id={`${id}-title`} className="flex items-baseline gap-4 text-2xl font-semibold tracking-tight sm:text-3xl">
        <span aria-hidden className="font-mono text-sm text-accent">
          {String(index).padStart(2, "0")}
        </span>
        {children}
      </h2>
    </Reveal>
  );
}

export default async function CaseStudyPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const found = getCaseStudy(slug);
  if (!found) notFound();
  const { study, prev, next } = found;
  // Header illustration: the project's stack, real logos first (deduped),
  // monograms filling any remaining slots.
  const withLogo = study.techStack
    .map((t) => ({ name: logoForTech(t), label: t }))
    .filter((l, i, all) => l.name && all.findIndex((o) => o.name === l.name) === i);
  const withoutLogo = study.techStack.filter((t) => !logoForTech(t)).map((t) => ({ label: t, monogram: monogramFor(t) }));
  const artLogos = [...withLogo, ...withoutLogo].slice(0, 6);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Projects", path: "/projects" },
            { name: study.title, path: `/projects/${study.slug}` },
          ]),
          caseStudyJsonLd({
            title: study.title,
            description: study.description,
            path: `/projects/${study.slug}`,
            keywords: study.techStack,
          }),
        ]}
      />

      <div className="shell pt-[max(6rem,calc(env(safe-area-inset-top)+4.5rem))] lg:pt-36">
        <MotionLink
          href="/projects"
          {...hoverTrigger}
          className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <span className="rotate-180">
            <ArrowRightIcon size={14} />
          </span>
          All projects
        </MotionLink>
      </div>

      <PageHeader
        eyebrow={study.domain}
        icon={<LayersIcon size={14} trigger="mount" />}
        title={study.title}
        description={study.tagline}
        tight
        art={<HeaderArt variant="case-study" project={study.slug} logos={artLogos} />}
        aside={
          <dl className="glass grid min-w-64 gap-4 rounded-2xl p-5 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-widest text-muted-foreground">Period</dt>
              <dd className="mt-1 font-mono text-foreground">{study.period}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-widest text-muted-foreground">My role</dt>
              <dd className="mt-1 flex max-w-xs gap-2 text-foreground">
                <BriefcaseIcon size={16} trigger="mount" className="mt-0.5 shrink-0 text-accent" />
                {study.role}
              </dd>
            </div>
            {study.outcome ? (
              <div>
                <dt className="text-xs uppercase tracking-widest text-muted-foreground">Outcome</dt>
                <dd className="mt-1 max-w-xs text-foreground">{study.outcome}</dd>
              </div>
            ) : null}
          </dl>
        }
      />

      {study.image ? (
        <Section className="pb-0 sm:pb-0">
          <Image
            src={study.image}
            alt={`${study.title} screenshot`}
            width={1600}
            height={900}
            className="h-auto w-full rounded-2xl border border-border/70"
          />
        </Section>
      ) : null}

      {/* Stat strip */}
      <Section className="pb-0 sm:pb-0">
        <Stagger className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border/70 bg-border/60">
          {study.stats.map((s) => (
            <RevealItem key={s.label} className="bg-background/80 p-4 backdrop-blur sm:p-6">
              <p className="text-2xl font-semibold tracking-tight text-gradient sm:text-5xl">
                <CountUp to={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-xs text-muted-foreground sm:text-sm">{s.label}</p>
            </RevealItem>
          ))}
        </Stagger>
      </Section>

      <Section>
        <div className="grid gap-12 xl:grid-cols-[16rem_1fr] xl:gap-16">
          <aside className="hidden xl:block">
            <div className="sticky top-28">
              <CaseStudyToc sections={SECTIONS} />
            </div>
          </aside>

          <div className="sticky top-[calc(var(--header-offset)+0.5rem)] z-20 -mx-1 px-1 xl:hidden">
            <CaseStudyToc sections={SECTIONS} variant="rail" />
          </div>

          <article className="min-w-0 space-y-20">
            <section id="problem" aria-labelledby="problem-title" className="scroll-mt-28">
              <SectionTitle id="problem" index={1}>The problem</SectionTitle>
              <Reveal>
                <p className="max-w-3xl text-pretty text-xl leading-relaxed text-foreground/90">{study.problem}</p>
                <p className="mt-5 max-w-3xl text-pretty leading-relaxed text-muted-foreground">{study.description}</p>
              </Reveal>
            </section>

            <section id="approach" aria-labelledby="approach-title" className="scroll-mt-28">
              <SectionTitle id="approach" index={2}>Approach</SectionTitle>
              <ol className="grid gap-5 md:grid-cols-2">
                {study.approach.map((step, i) => (
                  <SpotlightCard as="li" key={step.title} index={i} className="p-7">
                    <span className="font-mono text-xs text-accent">Step {i + 1}</span>
                    <h3 className="mt-2 text-lg font-semibold tracking-tight">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                  </SpotlightCard>
                ))}
              </ol>
            </section>

            <section id="architecture" aria-labelledby="architecture-title" className="scroll-mt-28">
              <SectionTitle id="architecture" index={3}>Architecture</SectionTitle>
              <ArchitectureDiagram layers={study.architecture} />
            </section>

            <section id="impact" aria-labelledby="impact-title" className="scroll-mt-28">
              <SectionTitle id="impact" index={4}>Impact</SectionTitle>
              <Stagger as="ul" className="grid gap-4 md:grid-cols-2">
                {study.impact.map((item) => (
                  <RevealItem as="li" key={item} className="flex gap-4 rounded-2xl border border-border/70 bg-card/60 p-6">
                    <CheckCircleIcon size={20} className="mt-0.5 shrink-0 text-accent" />
                    <span className="leading-relaxed text-foreground/85">{item}</span>
                  </RevealItem>
                ))}
              </Stagger>
            </section>

            <section id="stack" aria-labelledby="stack-title" className="scroll-mt-28">
              <SectionTitle id="stack" index={5}>Tech stack</SectionTitle>
              <Stagger as="ul" fast className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {study.techStack.map((t) => {
                  const logo = logoForTech(t);
                  return (
                    <RevealItem
                      as="li"
                      key={t}
                      className="group flex items-center gap-3 rounded-xl border border-border/70 bg-card/60 p-4 transition-colors hover:border-accent/50"
                    >
                      <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-border/70 bg-background/60 transition-colors group-hover:text-accent">
                        <TechLogo name={logo} fallback={logo ? undefined : monogramFor(t)} size={20} />
                      </span>
                      <span className="text-sm font-medium">{t}</span>
                    </RevealItem>
                  );
                })}
              </Stagger>
            </section>
          </article>
        </div>
      </Section>

      {/* Prev / next */}
      <Section className="pt-0 sm:pt-0">
        <nav aria-label="More case studies" className="grid gap-4 md:grid-cols-2">
          {[
            { label: "Previous", study: prev },
            { label: "Next", study: next },
          ].map(({ label, study: s }, i) => (
            <SpotlightCard key={label} index={i} className="p-0">
              <MotionLink
                href={`/projects/${s.slug}`}
                {...hoverTrigger}
                data-track="case_study_open"
                data-track-label={s.slug}
                className={`flex items-center gap-4 p-7 ${i === 1 ? "md:flex-row-reverse md:text-right" : ""}`}
              >
                <span className={`grid size-12 shrink-0 place-items-center rounded-full border border-border/70 ${i === 0 ? "rotate-180" : ""}`}>
                  <ArrowRightIcon size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs uppercase tracking-widest text-muted-foreground">{label} case study</span>
                  <span className="mt-1 block truncate text-lg font-semibold">{s.title}</span>
                </span>
              </MotionLink>
            </SpotlightCard>
          ))}
        </nav>
      </Section>
    </>
  );
}
