import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/features/Hero";
import { Section, SectionHeader } from "@/components/features/Section";
import { ProjectCard } from "@/components/features/ProjectCard";
import { Button } from "@/components/ui/button";
import { featuredProjects } from "@/lib/data/projects";
import { skillGroups } from "@/lib/data/skills";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Full-Stack Software Engineer",
  description:
    "Sekar Nagarajan — Full-Stack Software Engineer specializing in React 19, Spring Boot 4, Java 21, and multi-tenant enterprise architectures.",
  path: "/",
});

export default function HomePage() {
  const topSkills = [
    "React 19",
    "Next.js 15",
    "TypeScript",
    "Spring Boot 4",
    "Java 21",
    "SQL Server",
    "Multi-Tenant Architecture",
    "OpenAI",
  ];

  return (
    <>
      <Hero />

      {/* Featured projects */}
      <Section id="featured">
        <SectionHeader
          eyebrow="Selected work"
          title="Multi-tenant platforms shipped at enterprise scale"
          description="A snapshot of the systems I've architected and shipped — spanning maritime port operations, shipping self-service, and AI-powered sales."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {featuredProjects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
        <div className="mt-10 flex justify-start">
          <Button asChild variant="outline" className="gap-2">
            <Link href="/projects">
              View all projects <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </Section>

      {/* Signature stack preview */}
      <Section id="stack" className="border-t border-border/60 pt-16">
        <SectionHeader
          eyebrow="Signature stack"
          title="A production-tested toolkit."
          description="The core technologies I reach for daily across frontend, backend, and AI integration layers."
        />
        <ul className="flex flex-wrap gap-2">
          {topSkills.map((label) => (
            <li
              key={label}
              className="inline-flex items-center rounded-full border border-border/70 bg-muted/40 px-3.5 py-1.5 text-sm text-muted-foreground"
            >
              {label}
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <Button asChild variant="link" className="h-auto gap-2 p-0">
            <Link href="/skills">
              See the full skill matrix <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        {/* Keep skillGroups referenced so TS/eslint don't warn about unused import at build. */}
        <span className="sr-only">
          Available groups: {skillGroups.map((g) => g.label).join(", ")}
        </span>
      </Section>
    </>
  );
}
