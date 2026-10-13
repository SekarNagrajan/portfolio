import { Section, SectionHeader } from "@/components/features/Section";
import { ProjectCard } from "@/components/features/ProjectCard";
import { projects } from "@/lib/data/projects";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Projects",
  description:
    "Signature projects — multi-tenant CRM, maritime port operations (ANCHOR), shipping self-service (PAMS E-Commerce), and multi-principal port agency (PAMS Legacy).",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <Section id="projects">
      <SectionHeader
        eyebrow="Projects"
        title="Enterprise platforms, end-to-end."
        description="Four production systems I've architected and shipped — each framed in the real maritime / enterprise domain they serve, with the full tech stack and the architectural choices that mattered."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </Section>
  );
}
