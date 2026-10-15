import { ProjectsExperience } from "@/components/features/projects/ProjectsExperience";
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
      <ProjectsExperience />
    </>
  );
}
