import { Hero } from "@/components/features/Hero";
import { Section, SectionHeader } from "@/components/features/Section";
import { ViewAllLink } from "@/components/features/ViewAllLink";
import { StackShowcase } from "@/components/features/home/StackShowcase";
import { ProjectShowcase } from "@/components/features/home/ProjectShowcase";
import { CapabilityBento } from "@/components/features/home/CapabilityBento";
import { NowBand } from "@/components/features/home/NowBand";
import { CodeIcon, LayersIcon, SparklesIcon } from "@/components/icons/AnimatedIcons";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Full-Stack Software Engineer",
  description:
    "Sekar Nagarajan — Full-Stack Software Engineer who designs and ships scalable multi-tenant platforms with React 19, Spring Boot 4, and Java 21.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Tech stack — logo rails + plain-English layers */}
      <Section id="stack">
        <SectionHeader
          eyebrow="Tech stack"
          icon={<CodeIcon size={14} trigger="self" />}
          title={
            <>
              The tools behind <span className="text-gradient">every product</span>.
            </>
          }
          description="Five layers, from what people click to where the data lives, each explained in plain English."
          aside={<ViewAllLink href="/skills">Full skill matrix</ViewAllLink>}
        />
        <StackShowcase />
      </Section>

      {/* Selected work — scroll story with sticky previews */}
      <Section id="featured">
        <SectionHeader
          eyebrow="Selected work"
          icon={<LayersIcon size={14} trigger="self" />}
          title={
            <>
              Multi-tenant platforms shipped at <span className="text-gradient">enterprise scale</span>.
            </>
          }
          description="Three products I architected and shipped, each told as the challenge, what changed, and my role."
          aside={<ViewAllLink href="/projects">View all projects</ViewAllLink>}
        />
        <ProjectShowcase />
      </Section>

      {/* Capabilities bento */}
      <Section id="capabilities">
        <SectionHeader
          eyebrow="What I do"
          icon={<SparklesIcon size={14} trigger="self" />}
          title="From interface to data layer."
          description="I own features end to end, so what users see, how it works, and where the data lives stay aligned."
          aside={<ViewAllLink href="/about">More about me</ViewAllLink>}
        />
        <CapabilityBento />
      </Section>

      {/* Current role */}
      <Section id="now" className="pt-0 sm:pt-0">
        <NowBand />
      </Section>
    </>
  );
}
