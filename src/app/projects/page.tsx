import { HeaderArt } from "@/components/features/HeaderArt";
import { PageHeader, Section } from "@/components/features/Section";
import { ProjectCard } from "@/components/features/ProjectCard";
import { LayersIcon } from "@/components/icons/AnimatedIcons";
import { projects } from "@/lib/data/projects";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = buildMetadata({
  title: "Projects",
  description:
    "Signature projects — multi-tenant CRM, maritime port operations (ANCHOR), shipping self-service (PAMS E-Commerce), and multi-principal port agency (PAMS Legacy).",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Projects", path: "/projects" }])} />
      <PageHeader
        art={<HeaderArt variant="projects" />}
        eyebrow="Projects"
        icon={<LayersIcon size={14} trigger="self" />}
        title={
          <>
            Enterprise platforms, <span className="text-gradient">end-to-end</span>.
          </>
        }
        description="Four production systems I've architected and shipped — each framed in the real maritime / enterprise domain they serve, with the full tech stack and the architectural choices that mattered."
      />

      <Section id="projects">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </Section>
    </>
  );
}
